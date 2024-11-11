import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateScoreDto } from './dto/create-score.dto';
import { Score, ScoreDocument } from './scores.schema';
import { UsersService } from 'src/users/users.service';
import { URoles } from 'src/users/users.schema';

@Injectable()
export class ScoresService {
  constructor(
    @InjectModel(Score.name) private scoreModel: Model<ScoreDocument>,
    private readonly usersService: UsersService,
  ) {}

  async create(createScoreDto: CreateScoreDto): Promise<Score> {
    const newScore = new this.scoreModel(createScoreDto);
    return newScore.save();
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

  async remove(id: string): Promise<Score> {
    const removedScore = await this.scoreModel.findByIdAndDelete(id).exec();
    if (!removedScore) {
      throw new NotFoundException(`Score with ID ${id} not found`);
    }
    return removedScore;
  }
}
