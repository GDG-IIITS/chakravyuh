import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Max, Min } from 'class-validator';

export class UpdateScoreDto {
  @ApiProperty({ required: true, description: 'Score for the challenge' })
  @IsInt()
  @Min(0)
  @Max(1)
  score: number;
}
