import { Module } from '@nestjs/common';
import { ScoresService } from './scores.service';
import { ScoresController } from './scores.controller';
import { Score, ScoreSchema } from './scores.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ChallengesModule } from 'src/challenges/challenges.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Score.name,
        schema: ScoreSchema,
      },
    ]),
    ChallengesModule,
  ],
  controllers: [ScoresController],
  providers: [ScoresService],
})
export class ScoresModule {}
