import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateScoreDto } from 'src/scores/dto/create-score.dto';
import { Score } from 'src/scores/scores.schema';
import { ScoresService } from 'src/scores/scores.service';
import { TeamDocument } from 'src/teams/teams.schema';
import { TeamsService } from 'src/teams/teams.service';
import { URoles } from 'src/users/users.schema';
import { UsersService } from 'src/users/users.service';
import {
  Challenge,
  ChallengeDocument,
  VerificationKind,
} from './challenges.schema';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';

@Injectable()
export class ChallengesService {
  constructor(
    @InjectModel(Challenge.name)
    private challengeModel: Model<ChallengeDocument>,
    private readonly teamsService: TeamsService,
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => ScoresService))
    private readonly scoresService: ScoresService,
  ) {}

  async create(
    userId: string,
    createChallengeDto: CreateChallengeDto,
  ): Promise<Challenge> {
    let submissionVerification = {};

    if (
      createChallengeDto.submissionVerificationMode === VerificationKind.mono
    ) {
      console.log(createChallengeDto.flag);
      submissionVerification = {
        kind: VerificationKind.mono,
        flag: createChallengeDto.flag || '',
      };
    } else if (
      createChallengeDto.submissionVerificationMode === VerificationKind.unique
    ) {
      const flagsMap = this.parseStrToMap(createChallengeDto.flags);

      const isValid = await this.teamsService.validateTeams(
        Array.from(flagsMap.keys()),
      );

      if (!isValid) {
        throw new NotAcceptableException('Invalid team ids in the string');
      }

      submissionVerification = {
        kind: VerificationKind.unique,
        flags: flagsMap,
      };
    } else if (
      createChallengeDto.submissionVerificationMode === VerificationKind.custom
    ) {
      submissionVerification = {
        kind: VerificationKind.custom,
      };
    } else {
      throw new NotAcceptableException('Invalid Submission Verification Mode');
    }

    const newChallenge = new this.challengeModel({
      ...createChallengeDto,
      creator: userId,
      submissionVerification,
    });

    return await (await newChallenge.save()).populate('creator', 'fullName');
  }

  private parseStrToMap(str: string): Map<string, string> {
    // Format : teamId,flag,teamId,flag
    const teamsFlags = str.split(',');
    if (teamsFlags.length % 2 !== 0) {
      throw new NotAcceptableException('Invalid flags string');
    }

    const flagsMap = new Map<string, string>();
    for (let i = 0; i < teamsFlags.length; i += 2) {
      flagsMap.set(teamsFlags[i], teamsFlags[i + 1]);
    }

    return flagsMap;
  }

  // TODO: think through all the edge cases
  async canSubmit(team: TeamDocument, challenge: ChallengeDocument) {
    // TODO: check if team is dead
    // check if team is eligible to submit the challenge
    if (!challenge) {
      throw new NotFoundException(`Challenge with given not found`);
    }

    // const now = Date.now();
    // if (
    //   now > challenge.startTime.getTime() ||
    //   now < challenge.endTime.getTime()
    // ) {
    //   throw new NotAcceptableException('Challenge is not active');
    // }
    if (!team) {
      throw new NotFoundException('Team not found');
    }
    if (team.score == challenge.no) {
      throw new NotAcceptableException('Challenge already solved');
    }
    if (team.score + 1 !== challenge.no) {
      throw new NotAcceptableException(
        'Invalid challenge submission. First solve the previous challenges',
      );
    }
  }

  async findAll(): Promise<Challenge[]> {
    return this.challengeModel.find().populate('creator', 'fullName').exec();
  }

  async myDone(userId: string): Promise<Challenge[]> {
    const team = await this.teamsService.my(userId);

    const challengeIds = Array.from({ length: team.score + 1 }, (_, i) => i);
    return this.challengeModel
      .find({ no: { $in: challengeIds } })
      .select('-submissionVerification -hints')
      .populate('creator', 'fullName')
      .exec();
  }

  async myTodo(userId: string): Promise<Challenge> {
    const team = await this.teamsService.my(userId);
    const nextChallenge = await this.challengeModel
      .findOne({
        no: team.score + 1,
        // starttime: { $lte: new Date() },
        // endTime: { $gte: new Date() },
      })
      .select('-submissionVerification')
      .populate('creator', 'fullName')
      .exec();

    if (!nextChallenge) {
      throw new NotFoundException('No more challenges');
    }

    const hints = nextChallenge.hints.filter((hint) => hint.show);

    nextChallenge.hints = hints;

    return nextChallenge;
  }

  async verifySubmission(
    userId: string,
    challengeNo: number,
    flag: string,
  ): Promise<boolean> {
    const challenge = await this.challengeModel
      .findOne({ no: challengeNo })
      .exec();

    const user = await this.usersService.findById(userId);
    if (!user.team) {
      throw new NotFoundException('User not in a team');
    }
    const team = await this.teamsService.findById(user.team);

    await this.canSubmit(team, challenge);

    if (challenge.submissionVerification.kind === VerificationKind.mono) {
      if (challenge.submissionVerification.flag === '') {
        throw new ForbiddenException(
          'This challenge is not ready for evaluation. Please contact admins!',
        );
      }
      if (flag === challenge.submissionVerification.flag) {
        team.score += 1;
        await team.save();
        await this.scoresService.create({
          challenge: challenge.id,
          team: team.id,
          score: 1,
        });
        return true;
      } else {
        await this.scoresService.create({
          challenge: challenge.id,
          team: team.id,
          score: 0,
        });
        return false;
      }
    } else if (
      challenge.submissionVerification.kind === VerificationKind.unique
    ) {
      if (!challenge.submissionVerification.flags.has(user.team.toString())) {
        throw new ForbiddenException(
          'This challenge is not ready for evaluation. Please contact admins!',
        );
      }
      if (
        flag ===
        challenge.submissionVerification.flags.get(user.team.toString())
      ) {
        team.score += 1;
        await team.save();
        await this.scoresService.create({
          challenge: challenge.id,
          team: team.id,
          score: 1,
        });
        return true;
      } else {
        await this.scoresService.create({
          challenge: challenge.id,
          team: team.id,
          score: 0,
        });
        return false;
      }
    } else if (
      challenge.submissionVerification.kind === VerificationKind.custom
    ) {
      throw new ForbiddenException(
        'Submission of flag inside the terminal is not supported for this challenge. Once you correctly complete the challenge, you will automatically be awarded the points',
      );
    }
    return false;
  }

  async createViaApiKey(
    apiKey: string,
    createScoreDto: CreateScoreDto,
  ): Promise<Score> {
    const challenge = await this.findOne(createScoreDto.challenge);
    if (!challenge) {
      throw new NotFoundException(
        `Challenge with ID ${createScoreDto.challenge} not found`,
      );
    }
    const now = Date.now();
    if (
      now < challenge.startTime.getTime() ||
      now > challenge.endTime.getTime()
    ) {
      throw new ForbiddenException('Challenge is not active');
    }
    if (challenge.submissionVerification.kind != VerificationKind.custom) {
      throw new NotFoundException(
        `Challenge with ID ${createScoreDto.challenge}  score cannot be updated via API KEY`,
      );
    }
    if (apiKey !== challenge.submissionVerification.apiKey) {
      throw new ForbiddenException('Invalid API Key');
    }
    const team = await this.teamsService.findById(createScoreDto.team);
    await this.canSubmit(team, challenge);
    team.score += createScoreDto.score;
    return await this.scoresService.create(createScoreDto);
  }

  async markDone(
    userId: string,
    createScoreDto: CreateScoreDto,
  ): Promise<boolean> {
    const team = await this.teamsService.findById(createScoreDto.team);
    const challenge = await this.findOne(createScoreDto.challenge);
    const user = await this.usersService.findById(userId);
    if (challenge.creator != userId && user.role != URoles.superuser) {
      throw new ForbiddenException(
        'Only the creator of the challenge can mark it as done for a participant. Contact superuser for help!',
      );
    }
    await this.canSubmit(team, challenge);
    team.score += createScoreDto.score;
    await team.save();
    await this.scoresService.create(createScoreDto);
    return true;
  }

  async findOne(id: string): Promise<ChallengeDocument> {
    const challenge = await this.challengeModel.findById(id).exec();
    if (!challenge) {
      throw new NotFoundException(`Challenge with ID ${id} not found`);
    }
    return challenge;
  }

  async update(
    userId: string,
    id: string,
    updateChallengeDto: UpdateChallengeDto,
  ): Promise<Challenge> {
    const user = await this.usersService.findById(userId);
    const query = {};
    if (user.role != URoles.superuser) query['creator'] = userId;
    const updatedChallenge = await this.challengeModel
      .findOneAndUpdate(
        { _id: id, ...query },
        { ...updateChallengeDto, updatedAt: Date.now() },
        { new: true },
      )
      .exec();
    if (!updatedChallenge) {
      throw new ForbiddenException(
        `Challenge with ID ${id} not found, or you do not have permission to update it`,
      );
    }
    return updatedChallenge;
  }

  async remove(userId: string, id: string): Promise<Challenge> {
    const removedChallenge = await this.challengeModel
      .findOneAndDelete({ _id: id, creator: userId })
      .exec();
    if (!removedChallenge) {
      throw new ForbiddenException(
        `Challenge with ID ${id} not found, or might not have sufficient permissions to delete it`,
      );
    }
    return removedChallenge;
  }
}
