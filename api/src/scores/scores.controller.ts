import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Headers,
} from '@nestjs/common';
import { ScoresService } from './scores.service';
import { CreateScoreDto } from './dto/create-score.dto';
import { UpdateScoreDto } from './dto/update-score.dto';
import { Score } from './scores.schema';
import { URoles } from 'src/users/users.schema';
import { Roles } from 'src/auth/roles.decorator';
import { Public } from 'src/auth/public.decorator';

@Controller('scores')
export class ScoresController {
  constructor(private readonly scoresService: ScoresService) {}

  @Roles(URoles.admin)
  @Post()
  async create(@Body() createScoreDto: CreateScoreDto): Promise<Score> {
    return this.scoresService.create(createScoreDto);
  }

  @Public()
  async setScoreViaKey(
    @Body() createScoreDto: CreateScoreDto,
    @Headers('Chakravyuh Challenge Key') challengeScopedApiKey: string,
  ): Promise<Score> {
    const challengeApiKey = await this.
    return this.scoresService.create(createScoreDto);
  }

  @Get()
  async findAll(): Promise<Score[]> {
    return this.scoresService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Score> {
    return this.scoresService.findOne(id);
  }

  @Roles(URoles.admin)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateScoreDto: UpdateScoreDto,
  ): Promise<Score> {
    return this.scoresService.update(id, updateScoreDto);
  }

  @Roles(URoles.admin)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Score> {
    return this.scoresService.remove(id);
  }
}
