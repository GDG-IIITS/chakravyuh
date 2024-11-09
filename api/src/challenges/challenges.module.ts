import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TeamsModule } from 'src/teams/teams.module';
import { ChallengesController } from './challenges.controller';
import { Challenge, ChallengeSchema } from './challenges.schema';
import { ChallengesService } from './challenges.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Challenge.name,
        schema: ChallengeSchema,
      },
    ]),
    TeamsModule,
  ],
  controllers: [ChallengesController],
  providers: [ChallengesService],
  exports: [ChallengesService],
})
export class ChallengesModule {}
