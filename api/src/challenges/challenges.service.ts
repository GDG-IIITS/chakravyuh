import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { parse } from 'csv-parse/sync';
import { Model } from 'mongoose';
import {
  Challenge,
  ChallengeDocument,
  SubmissionVerification,
  VerificationKind,
} from './challenges.schema';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';

@Injectable()
export class ChallengesService {
  constructor(
    @InjectModel(Challenge.name)
    private challengeModel: Model<ChallengeDocument>,
  ) {}

  async create(
    userId: string,
    createChallengeDto: CreateChallengeDto,
  ): Promise<Challenge> {
    let submissionVerification = {};

    if (
      createChallengeDto.submissionVerificationMode === VerificationKind.mono
    ) {
      submissionVerification = {
        kind: VerificationKind.mono,
        flag: createChallengeDto.flag || '',
      };
    } else if (
      createChallengeDto.submissionVerificationMode === VerificationKind.unique
    ) {
      const flagsMap = this.parseCsvToMap(createChallengeDto.flags);
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
      throw new Error('Invalid submissionVerificationMode');
    }

    const newChallenge = new this.challengeModel({
      ...createChallengeDto,
      creator: userId,
      submissionVerification,
    });

    return await newChallenge.save();
  }

  private parseCsvToMap(csv: string): Map<string, string> {
    const records = parse(csv, {
      columns: ['teamId', 'flag'],
      skip_empty_lines: true,
    });

    const flagsMap = new Map<string, string>();
    records.forEach((record: { teamId: string; flag: string }) => {
      flagsMap.set(record.teamId, record.flag);
    });

    return flagsMap;
  }

  async findAll(): Promise<Challenge[]> {
    return this.challengeModel.find().exec();
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
