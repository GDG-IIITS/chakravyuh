import { IsEmail, IsUrl } from 'class-validator';

export class ResetPasswordDto {
  @IsEmail()
  email: string;

  @IsUrl()
  frontendBase: string;
}
