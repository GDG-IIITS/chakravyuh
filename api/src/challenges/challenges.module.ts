import { Module } from '@nestjs/common';
import { ChallengesService } from './challenges.service';
import { ChallengesController } from './challenges.controller';

@Module({
  controllers: [ChallengesController],
  providers: [ChallengesService],
})
export class ChallengesModule {}
