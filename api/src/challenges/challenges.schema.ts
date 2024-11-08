import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { initDiscriminators } from 'src/utils/disc';

export enum VerificationKind {
  monoFlag = 'monoFlag', // single flag for all participants
  teamwiseFlag = 'teamwiseFlag', // unique flag for each team
  customVerification = 'customVerification', // custom verification logic by challenge creator
  // challenge creator will get an api key which they can use to update scores for this challenge
}

@Schema({ _id: false, discriminatorKey: 'kind' })
export class SubmissionVerification {
  kind!: string;
}

export class MonoFlagVerification extends SubmissionVerification {
  kind!: VerificationKind.monoFlag;
  flag: string;
}

export class TeamwiseFlagVerification extends SubmissionVerification {
  kind!: VerificationKind.teamwiseFlag;
  flags: Map<string, string>;
  // map between team id and flag
}

export class CustomVerification extends SubmissionVerification {
  kind = VerificationKind.customVerification;
  apiKey: string;
}

export class Hint {
  title: string;
  description: string;
  show: boolean;
}
@Schema()
export class Challenge {
  @Prop({ required: true })
  creator: string; // user id of creator

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

  @Prop({ required: true })
  submissionVerification:
    | MonoFlagVerification
    | TeamwiseFlagVerification
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
      name: MonoFlagVerification.name,
      schema: SchemaFactory.createForClass(MonoFlagVerification),
    },
    {
      name: TeamwiseFlagVerification.name,
      schema: SchemaFactory.createForClass(TeamwiseFlagVerification),
    },
    {
      name: CustomVerification.name,
      schema: SchemaFactory.createForClass(CustomVerification),
    },
  ],
);
