import { Module } from '@nestjs/common';
import { ScoresService } from './scores.service';
import { ScoresController } from './scores.controller';
import { Score, ScoreSchema } from './scores.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ChallengesModule } from 'src/challenges/challenges.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Score.name,
        schema: ScoreSchema,
      },
    ]),
    ChallengesModule,
    UsersModule,
  ],
  controllers: [ScoresController],
  providers: [ScoresService],
})
export class ScoresModule {}
