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
  kind!: string;
}

export class MonoVerification extends SubmissionVerification {
  kind!: VerificationKind.mono;
  @Prop({ required: true, default: '' })
  flag: string;
}

export class UniqueVerification extends SubmissionVerification {
  kind!: VerificationKind.unique;
  @Prop({ required: true, default: new Map() })
  flags: Map<string, string>;
  // map between team id and flag
}

export class Custom extends SubmissionVerification {
  kind = VerificationKind.custom;
  @Prop({ required: true, default: generateApiKey })
  apiKey: string;
}

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

  @Prop({ required: true, type: SubmissionVerification })
  submissionVerification: MonoVerification | UniqueVerification | Custom;

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
      name: MonoVerification.name,
      schema: SchemaFactory.createForClass(MonoVerification),
    },
    {
      name: UniqueVerification.name,
      schema: SchemaFactory.createForClass(UniqueVerification),
    },
    {
      name: Custom.name,
      schema: SchemaFactory.createForClass(Custom),
    },
  ],
);
