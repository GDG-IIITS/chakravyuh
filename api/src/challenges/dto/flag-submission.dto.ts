import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class FlagSubmissionDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  challengeNo: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  flag: string;
}
