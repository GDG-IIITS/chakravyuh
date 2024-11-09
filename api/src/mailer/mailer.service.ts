import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { appConfig } from 'src/app.config';
import { SendMailDto } from './dto/send-mail.dto';
import { SendTemplateDto } from './dto/send-template.dto';

@Injectable()
export class MailerService {
  transporter: any;
  templatesDir: string;

  constructor(@InjectQueue('mailer') private mailerQueue: Queue) {
    console.log(appConfig);
  }

  async sendTemplateMail(sendTemplateDto: SendTemplateDto) {
    switch (sendTemplateDto.templateType) {
      case 'register':
        sendTemplateDto.subject = 'Chakravyuh Account created successfully';
        sendTemplateDto.html = `Hello ${sendTemplateDto.username}, <br> <br> Your account has been created successfully. <br> <br> Regards, <br> Team GDGxIOTA`;
        break;
      case 'login':
        sendTemplateDto.subject = 'Chakravyuh Account login detected';
        sendTemplateDto.html = `Hello ${sendTemplateDto.username}, <br> <br> You have successfully logged in. <br> <br> Regards, <br> Team GDGxIOTA`;
        break;
      default:
        throw new Error('Invalid template type');
    }

    return await this.sendMail({
      recipients: sendTemplateDto.recipients,
      subject: sendTemplateDto.subject,
      text: sendTemplateDto.text,
      html: sendTemplateDto.html,
    });
  }

  async sendMail(sendMailDto: SendMailDto) {
    const job = await this.mailerQueue.add(
      `${Date.now()}-${sendMailDto.recipients}-${sendMailDto.subject}`,
      sendMailDto,
    );

    return job;
  }
}
