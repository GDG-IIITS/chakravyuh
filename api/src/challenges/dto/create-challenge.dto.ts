import { ApiProperty } from '@nestjs/swagger';
import { Hint, VerificationKind } from '../challenges.schema';

export class CreateChallengeDto {
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

  @ApiProperty({ description: 'Hints for the challenge' })
  hints: Hint[];

  @ApiProperty({
    enum: VerificationKind,
    enumName: 'VerificationKind',
    description: 'Submission verification for the challenge',
  })
  submissionVerificationMode: VerificationKind;
}
