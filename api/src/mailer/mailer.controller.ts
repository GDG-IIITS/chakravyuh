import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/roles.decorator';
import { URoles } from 'src/users/users.schema';
import { SendMailDto } from './dto/send-mail.dto';
import { MailerService } from './mailer.service';

@ApiCookieAuth()
@ApiBearerAuth()
@ApiTags('mailer')
@Controller('mailer')
export class MailerController {
  constructor(private readonly mailerService: MailerService) {}

  @Roles(URoles.superuser, URoles.admin)
  @Post('send')
  async sendMail(@Body() sendMailDto: SendMailDto) {
    return await this.mailerService.sendMail(sendMailDto);
  }
}
