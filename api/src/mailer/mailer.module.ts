import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { appConfig } from 'src/app.config';
import { MailProcessor } from './mail.processor';
import { MailerController } from './mailer.controller';
import { MailerService } from './mailer.service';

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: appConfig.redis.host,
        port: appConfig.redis.port,
      },
    }),
    BullModule.registerQueue({
      name: 'mailer',
    }),
  ],
  controllers: [MailerController],
  providers: [MailProcessor, MailerService],
  exports: [MailerService],
})
export class MailerModule {}
