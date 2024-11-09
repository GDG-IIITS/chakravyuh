import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Max, Min } from 'class-validator';

export class CreateScoreDto {
  @ApiProperty({ required: true, description: 'Team Id' })
  team: string;

  @ApiProperty({ required: true, description: 'Challenge Id' })
  challenge: string;

  @ApiProperty({ required: true, description: 'Score for the challenge' })
  @IsInt()
  @Min(0)
  @Max(1)
  score: number;
}
