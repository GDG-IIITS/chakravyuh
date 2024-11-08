import { ApiProperty } from '@nestjs/swagger';
import { IsAlphanumeric, IsInt, Length, Max, Min } from 'class-validator';

export class CreateTeamDto {
  @IsAlphanumeric()
  @Length(5, 20)
  @ApiProperty({ description: 'Name of the team' })
  name: string;

  @IsInt()
  @Min(1)
  @Max(4)
  @ApiProperty({ description: 'UG of the team (1/2/3/4' })
  ug: number;
}
