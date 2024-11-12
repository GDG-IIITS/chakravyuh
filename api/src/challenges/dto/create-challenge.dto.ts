import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Hint, VerificationKind } from '../challenges.schema';

export class CreateChallengeDto {
  @ApiProperty({ required: true, description: 'Number of the challenge' })
  no: number;

  @ApiProperty({ required: true, description: 'Title of the challenge' })
  title: string;

  @ApiProperty({ required: true, description: 'Summary of the challenge' })
  summary: string;

  @ApiProperty({ required: true, description: 'Tags for the challenge' })
  tags: string[];

  @ApiProperty({
    required: true,
    description: 'Description of the challenge in markdown',
  })
  description: string;

  @ApiProperty({
    description: 'Hints for the challenge',
    type: [Hint],
    default: [{ text: 'Some hint here', show: false }],
  })
  hints: Hint[];

  @ApiProperty({ required: true, description: 'Start time of the challenge' })
  startTime: Date;

  @ApiProperty({ required: true, description: 'End time of the challenge' })
  endTime: Date;

  @ApiProperty({
    enum: VerificationKind,
    enumName: 'VerificationKind',
    description: 'Submission verification for the challenge',
  })
  submissionVerificationMode: VerificationKind;

  @ApiPropertyOptional({
    description: 'Flag for mono submission verification mode',
  })
  flag?: string;

  @ApiPropertyOptional({
    description: 'Flags for unique submission verification mode',
  })
  flags?: string[];
}
