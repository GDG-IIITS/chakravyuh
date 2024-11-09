import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Headers,
  Req,
} from '@nestjs/common';
import { ScoresService } from './scores.service';
import { CreateScoreDto } from './dto/create-score.dto';
import { UpdateScoreDto } from './dto/update-score.dto';
import { Score } from './scores.schema';
import { URoles } from 'src/users/users.schema';
import { Roles } from 'src/auth/roles.decorator';
import { Public } from 'src/auth/public.decorator';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

@ApiTags('scores')
@Controller('scores')
export class ScoresController {
  constructor(private readonly scoresService: ScoresService) {}

  @Roles(URoles.admin, URoles.superuser)
  @Post()
  @ApiOperation({
    summary:
      'Create a score entry associated with a team for a specific challenge',
  })
  async create(@Body() createScoreDto: CreateScoreDto): Promise<Score> {
    return this.scoresService.create(createScoreDto);
  }

  @Public()
  @ApiOperation({
    summary:
      'Create a score entry associated with a team for a specific challenge using challenge API Key',
  })
  @Post('verify')
  async setScoreViaKey(
    @Body() createScoreDto: CreateScoreDto,
    @Headers('Authorization') apiKey: string,
  ): Promise<Score> {
    console.log(apiKey);
    return this.scoresService.createViaApiKey(apiKey, createScoreDto);
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

  @Roles(URoles.admin, URoles.superuser)
  @Put(':id')
  @ApiOperation({
    summary: '[ADMIN] Update score entry by id (challenge creator)',
  })
  async update(
    @Param('id') id: string,
    @Body() updateScoreDto: UpdateScoreDto,
    @Req() req: Request,
  ): Promise<Score> {
    return this.scoresService.update(req['user'].id, id, updateScoreDto);
  }

  @Roles(URoles.superuser)
  @ApiOperation({ summary: '[SUDO] Delete score entry by id' })
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Score> {
    return this.scoresService.remove(id);
  }
}
