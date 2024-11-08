import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TeamsModule } from './teams/teams.module';
import { ChallengesModule } from './challenges/challenges.module';
import { ScoresModule } from './scores/scores.module';

@Module({
  imports: [UsersModule, AuthModule, TeamsModule, ChallengesModule, ScoresModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
