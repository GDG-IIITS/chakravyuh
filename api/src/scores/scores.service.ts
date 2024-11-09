import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { VerificationKind } from 'src/challenges/challenges.schema';
import { ChallengesService } from 'src/challenges/challenges.service';
import { CreateScoreDto } from './dto/create-score.dto';
import { UpdateScoreDto } from './dto/update-score.dto';
import { Score, ScoreDocument } from './scores.schema';
import { UsersService } from 'src/users/users.service';
import { URoles } from 'src/users/users.schema';
import { TeamsService } from 'src/teams/teams.service';

@Injectable()
export class ScoresService {
  constructor(
    @InjectModel(Score.name) private scoreModel: Model<ScoreDocument>,
    private readonly challengeService: ChallengesService,
    private readonly usersService: UsersService,
    private readonly teamsService: TeamsService,
  ) {}

  async create(createScoreDto: CreateScoreDto): Promise<Score> {
    const newScore = new this.scoreModel(createScoreDto);
    return newScore.save();
  }

  async createViaApiKey(
    apiKey: string,
    createScoreDto: CreateScoreDto,
  ): Promise<Score> {
    const challenge = await this.challengeService.findOne(
      createScoreDto.challenge,
    );
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
    await this.challengeService.canSubmit(team, challenge);
    team.score += createScoreDto.score;
    return await this.create(createScoreDto);
  }

  async findAll(userId: string): Promise<Score[]> {
    // only admins can see all scores
    // normal users can only see scores(submission entries) for their team
    const user = await this.usersService.findById(userId);
    const query = {};
    if (user.role === URoles.user) {
      query['team'] = user.team;
    }
    return this.scoreModel.find(query).exec();
  }

  async findOne(id: string): Promise<Score> {
    const score = await this.scoreModel.findById(id).exec();
    if (!score) {
      throw new NotFoundException(`Score with ID ${id} not found`);
    }
    return score;
  }

  async update(
    userId: string,
    id: string,
    updateScoreDto: UpdateScoreDto,
  ): Promise<Score> {
    const user = await this.usersService.findById(userId);
    const score = await this.findOne(id);
    const challenge = await this.challengeService.findOne(score.challenge);
    if (!challenge.creator === user.id && user.role !== URoles.superuser) {
      throw new ForbiddenException(
        'You are not allowed to update this score entry!',
      );
    }
    const updatedScore = await this.scoreModel
      .findByIdAndUpdate(
        id,
        { ...updateScoreDto, updatedAt: Date.now() },
        { new: true },
      )
      .exec();
    if (!updatedScore) {
      throw new NotFoundException(`Score with ID ${id} not found`);
    }
    return updatedScore;
  }

  async remove(id: string): Promise<Score> {
    const removedScore = await this.scoreModel.findByIdAndDelete(id).exec();
    if (!removedScore) {
      throw new NotFoundException(`Score with ID ${id} not found`);
    }
    return removedScore;
  }
}
