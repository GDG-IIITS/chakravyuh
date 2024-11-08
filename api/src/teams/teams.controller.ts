import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { CreateTeamDto } from './dto/create-team.dto';
import { JoinTeamDto } from './dto/join-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { Team } from './teams.schema';
import { TeamsService } from './teams.service';
@ApiTags('teams')
@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a team' })
  async create(
    @Req() req: Request,
    @Body() createTeamDto: CreateTeamDto,
  ): Promise<Team> {
    return this.teamsService.create(req['user'].id, createTeamDto);
  }

  @Post('/join')
  @ApiOperation({ summary: 'Join a team' })
  async join(
    @Req() req: Request,
    @Body() joinTeamDto: JoinTeamDto,
  ): Promise<Team> {
    return this.teamsService.join(req['user'].id, joinTeamDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all teams' })
  async findAll(): Promise<Team[]> {
    return this.teamsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find team by id' })
  async findOne(@Param('id') id: string): Promise<Team> {
    return this.teamsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update team by id' })
  async update(
    @Param('id') id: string,
    @Body() updateTeamDto: UpdateTeamDto,
  ): Promise<Team> {
    return this.teamsService.update(id, updateTeamDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete team by id' })
  async remove(@Param('id') id: string): Promise<Team> {
    return this.teamsService.remove(id);
  }
}
