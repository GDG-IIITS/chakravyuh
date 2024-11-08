import { IsUrl } from 'class-validator';

export class VerifyEmailDto {
  @IsUrl()
  frontendBase: string;
}
