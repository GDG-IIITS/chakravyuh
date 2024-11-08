import { ApiProperty } from '@nestjs/swagger';
import { IsAlphanumeric } from 'class-validator';

export class JoinTeamDto {
  @IsAlphanumeric()
  @ApiProperty({ description: 'Join Code' })
  code: string;
}
