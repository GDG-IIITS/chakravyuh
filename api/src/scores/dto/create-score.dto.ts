import { ApiProperty } from '@nestjs/swagger';

export class CreateScoreDto {
  @ApiProperty({ required: true, description: 'Team Id' })
  team: string;

  @ApiProperty({ required: true, description: 'Challenge Id' })
  challenge: string;

  @ApiProperty({ required: true, description: 'Score for the challenge' })
  score: number;
}
