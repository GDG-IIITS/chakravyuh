import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

@Schema()
export class Score {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true })
  team: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Challenge',
    required: true,
  })
  challenge: string;

  @Prop({ required: true })
  score: number;

  @Prop({ required: true, default: Date.now })
  createdAt: Date;

  @Prop({ required: true, default: Date.now })
  updatedAt: Date;
}

export type ScoreDocument = HydratedDocument<Score>;
export const ScoreSchema = SchemaFactory.createForClass(Score);
