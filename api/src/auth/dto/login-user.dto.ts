import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, Length } from 'class-validator';

export class LoginUserDto {
  @IsEmail()
  @ApiProperty({ default: 'team@chakravyuh.live' })
  email: string;

  @Length(8, 128)
  @ApiProperty({ default: 'secure and long password' })
  password: string;
}
