import { IsNotEmpty, Length } from 'class-validator';

export class VerifyResetPasswordDto {
  @IsNotEmpty()
  token: string;

  @Length(8, 128)
  password: string;
}
