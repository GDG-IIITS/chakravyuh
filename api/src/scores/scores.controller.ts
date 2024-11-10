import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { ScoresService } from './scores.service';
import { CreateScoreDto } from './dto/create-score.dto';
import { Score } from './scores.schema';
import { URoles } from 'src/users/users.schema';
import { Roles } from 'src/auth/roles.decorator';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

@ApiTags('scores')
@Controller('scores')
export class ScoresController {
  constructor(private readonly scoresService: ScoresService) {}

  @Roles(URoles.superuser)
  @Post()
  @ApiOperation({
    summary:
      '[SUDO] Create a score entry associated with a team for a specific challenge',
  })
  async create(@Body() createScoreDto: CreateScoreDto): Promise<Score> {
    return this.scoresService.create(createScoreDto);
  }

  @Get()
  @ApiOperation({
    summary:
      'Get all scores entries(for admins), users will get their own submission entries',
  })
  async findAll(@Req() req: Request): Promise<Score[]> {
    return this.scoresService.findAll(req['user'].id);
  }

  @Roles(URoles.admin, URoles.superuser)
  @Get(':id')
  @ApiOperation({ summary: '[ADMIN] Find score entry by id' })
  async findOne(@Param('id') id: string): Promise<Score> {
    return this.scoresService.findOne(id);
  }

  @Roles(URoles.superuser)
  @ApiOperation({ summary: '[SUDO] Delete score entry by id' })
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Score> {
    return this.scoresService.remove(id);
  }
}
