import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Team, TeamDocument } from './teams.schema';
import { Model } from 'mongoose';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class TeamsService {
  constructor(
    @InjectModel(Team.name) private teamsModel: Model<TeamDocument>,
    private readonly userService: UsersService,
  ) {}

  async create(userId: string, createTeamDto: CreateTeamDto): Promise<Team> {
    const newTeam = new this.teamsModel({ ...createTeamDto, lead: userId });
    const team = await newTeam.save();
    const user = await this.userService.findById(userId);
    user.team = newTeam.id;
    await user.save();
    return team;
  }

  async findAll(): Promise<Team[]> {
    return this.teamsModel.find().exec();
  }

  async findOne(id: string): Promise<Team> {
    const team = await this.teamsModel.findById(id);
    if (!team) {
      throw new NotFoundException(`Team with ID ${id} not found`);
    }
    return team;
  }

  async update(id: string, updateTeamDto: UpdateTeamDto): Promise<Team> {
    const updatedTeam = await this.teamsModel
      .findByIdAndUpdate(id, updateTeamDto, { new: true })
      .exec();
    if (!updatedTeam) {
      throw new NotFoundException(`Team with ID ${id} not found`);
    }
    return updatedTeam;
  }

  async remove(id: string): Promise<Team> {
    const removedTeam = await this.teamsModel.findByIdAndDelete(id).exec();
    if (!removedTeam) {
      throw new NotFoundException(`Team with ID ${id} not found`);
    }
    return removedTeam;
  }
}
