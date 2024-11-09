import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { Roles } from 'src/auth/roles.decorator';
import { URoles } from 'src/users/users.schema';
import { Challenge } from './challenges.schema';
import { ChallengesService } from './challenges.service';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';

@ApiTags('challenges')
@Controller('challenges')
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) {}

  @Roles(URoles.superuser, URoles.admin)
  @Post()
  @ApiOperation({ summary: 'Create a challenge' })
  async create(
    @Req() req: Request,
    @Body() createChallengeDto: CreateChallengeDto,
  ): Promise<Challenge> {
    return await this.challengesService.create(
      req['user'].id,
      createChallengeDto,
    );
  }

  @Roles(URoles.superuser, URoles.admin)
  @Get()
  @ApiOperation({ summary: '[ADMIN] Get all challenges' })
  async findAll(): Promise<Challenge[]> {
    return await this.challengesService.findAll();
  }

  @Roles(URoles.superuser, URoles.admin)
  @Get(':id')
  @ApiOperation({ summary: 'Find challenge by id' })
  async findOne(@Param('id') id: string): Promise<Challenge> {
    return await this.challengesService.findOne(id);
  }

  @Get('/me/done')
  @ApiOperation({ summary: 'Get all challenges done by participant' })
  async myDone(@Req() req: Request): Promise<Challenge[]> {
    return await this.challengesService.myDone(req['user'].id);
  }

  @Get('/me/todo')
  @ApiOperation({ summary: 'Get next challenge for participant' })
  async myTodo(@Req() req: Request): Promise<Challenge> {
    return await this.challengesService.myTodo(req['user'].id);
  }

  @Roles(URoles.superuser, URoles.admin)
  @Put(':id')
  @ApiOperation({
    summary:
      '[SUDO] Update challenge by id. Only the creator of challenge, or superuser can do this',
  })
  async update(
    @Param('id') id: string,
    @Body() updateChallengeDto: UpdateChallengeDto,
    @Req() req: Request,
  ): Promise<Challenge> {
    return await this.challengesService.update(
      req['user'].id,
      id,
      updateChallengeDto,
    );
  }

  @Roles(URoles.superuser, URoles.admin)
  @Delete(':id')
  @ApiOperation({
    summary: '[SUDO] Delete challenge by id. (creator/superuser)',
  })
  async remove(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<Challenge> {
    return await this.challengesService.remove(req['user'].id, id);
  }
}
