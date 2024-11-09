import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class FlagSubmissionDto {
  @ApiProperty()
  @IsInt()
  challengeNo: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  flag: string;
}
