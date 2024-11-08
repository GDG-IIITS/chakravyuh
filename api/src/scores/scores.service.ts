import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateScoreDto } from './dto/create-score.dto';
import { UpdateScoreDto } from './dto/update-score.dto';
import { Score, ScoreDocument } from './scores.schema';

@Injectable()
export class ScoresService {
  constructor(
    @InjectModel(Score.name) private scoreModel: Model<ScoreDocument>,
  ) {}

  async create(createScoreDto: CreateScoreDto): Promise<Score> {
    const newScore = new this.scoreModel(createScoreDto);
    return newScore.save();
  }

  async findAll(): Promise<Score[]> {
    return this.scoreModel.find().exec();
  }

  async findOne(id: string): Promise<Score> {
    const score = await this.scoreModel.findById(id).exec();
    if (!score) {
      throw new NotFoundException(`Score with ID ${id} not found`);
    }
    return score;
  }

  async update(id: string, updateScoreDto: UpdateScoreDto): Promise<Score> {
    const updatedScore = await this.scoreModel
      .findByIdAndUpdate(id, updateScoreDto, { new: true })
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
