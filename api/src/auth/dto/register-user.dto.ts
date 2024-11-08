import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class RegisterUserDto {
  @IsEmail()
  @ApiProperty({ default: 'team@chakravyuh.live' })
  email: string;

  @Length(8, 128)
  @ApiProperty({ default: 'secure and long password' })
  password: string;

  @IsNotEmpty()
  @ApiProperty({ default: 'Ckvh Team' })
  fullName: string;
}
