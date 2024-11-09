import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class FlagSubmissionDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  challengeId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  flag: string;
}
