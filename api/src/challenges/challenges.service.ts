import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TeamsService } from 'src/teams/teams.service';
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

    return await newChallenge.save();
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

  async findAll(): Promise<Challenge[]> {
    return this.challengeModel.find().exec();
  }

  async myDone(userId: string): Promise<Challenge[]> {
    const team = await this.teamsService.my(userId);

    const challengeIds = Array.from({ length: team.score }, (_, i) => i + 1);

    console.log(challengeIds);
    return this.challengeModel
      .find({ no: { $in: challengeIds } })
      .select('-submissionVerification -hints')
      .exec();
  }

  async myTodo(userId: string): Promise<Challenge> {
    const team = await this.teamsService.my(userId);

    const nextChallenge = await this.challengeModel
      .findOne({ no: team.score + 1 })
      .select('-submissionVerification')
      .exec();

    const hints = nextChallenge.hints.filter((hint) => hint.show);

    if (!nextChallenge) {
      throw new NotFoundException('No more challenges');
    }

    nextChallenge.hints = hints;

    return nextChallenge;
  }

  async findOne(id: string): Promise<Challenge> {
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
    const updatedChallenge = await this.challengeModel
      .findByIdAndUpdate(
        id,
        { ...updateChallengeDto, creator: userId, updatedAt: Date.now() },
        { new: true },
      )
      .exec();
    if (!updatedChallenge) {
      throw new NotFoundException(
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
      throw new NotFoundException(`Challenge with ID ${id} not found`);
    }
    return removedChallenge;
  }
}
