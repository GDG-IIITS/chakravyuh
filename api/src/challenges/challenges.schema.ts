import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { initDiscriminators } from 'src/utils/disc';

export enum VerificationKind {
  mono = 'mono', // single flag for all participants
  unique = 'unique', // unique flag for each team
  custom = 'custom', // custom verification logic by challenge creator
  // challenge creator will get an api key which they can use to update scores for this challenge
}

export function generateApiKey() {
  return (
    'ckrvh_' +
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

@Schema({ _id: false, discriminatorKey: 'kind' })
export class SubmissionVerification {
  @Prop({ required: true, enum: VerificationKind })
  kind!: string;
}

export const SubmissionVerificationSchema = SchemaFactory.createForClass(
  SubmissionVerification,
);

@Schema({ _id: false })
export class MonoVerification {
  kind!: VerificationKind.mono;

  @Prop({ required: true, default: '' })
  flag: string;
}

@Schema({ _id: false })
export class UniqueVerification {
  kind!: VerificationKind.unique;

  @Prop({ required: true, default: {} })
  flags: Map<string, string>;
  // map between team id and flag
}

@Schema({ _id: false })
export class CustomVerification {
  kind!: VerificationKind.custom;

  @Prop({ required: true, default: generateApiKey })
  apiKey: string;
}

@Schema({ _id: false })
export class Hint {
  text: string;
  show: boolean;
}

@Schema()
export class Challenge {
  @Prop({ required: true })
  creator: string; // user id of creator

  @Prop({ required: true, unique: true })
  no: number; // challenge number

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  summary: string;

  @Prop({ required: true, default: [] })
  tags: string[];

  @Prop({ required: true })
  startTime: Date;

  @Prop({ required: true })
  endTime: Date;

  @Prop({ required: true })
  description: string;

  @Prop({ required: false })
  hints: Hint[];

  @Prop({
    required: true,
    type: SubmissionVerificationSchema,
  })
  submissionVerification:
    | MonoVerification
    | UniqueVerification
    | CustomVerification;

  @Prop({ required: true, default: Date.now })
  createdAt: Date;

  @Prop({ required: true, default: Date.now })
  updatedAt: Date;
}

export type ChallengeDocument = HydratedDocument<Challenge>;
export const ChallengeSchema = initDiscriminators(
  Challenge,
  'submissionVerification',
  [
    {
      name: 'mono',
      schema: SchemaFactory.createForClass(MonoVerification),
    },
    {
      name: 'unique',
      schema: SchemaFactory.createForClass(UniqueVerification),
    },
    {
      name: 'custom',
      schema: SchemaFactory.createForClass(CustomVerification),
    },
  ],
);
