import { ApiProperty } from '@nestjs/swagger';
import { IsAlphanumeric, Length } from 'class-validator';

export class CreateTeamDto {
  @IsAlphanumeric()
  @Length(1, 20)
  @ApiProperty({ description: 'Name of the team' })
  name: string;
}
