import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TeamsModule } from 'src/teams/teams.module';
import { UsersModule } from 'src/users/users.module';
import { ChallengesController } from './challenges.controller';
import { Challenge, ChallengeSchema } from './challenges.schema';
import { ChallengesService } from './challenges.service';
import { ScoresModule } from 'src/scores/scores.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Challenge.name,
        schema: ChallengeSchema,
      },
    ]),
    TeamsModule,
    UsersModule,
    forwardRef(() => ScoresModule),
  ],
  controllers: [ChallengesController],
  providers: [ChallengesService],
  exports: [ChallengesService],
})
export class ChallengesModule {}
