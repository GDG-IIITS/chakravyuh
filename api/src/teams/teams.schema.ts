import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, ObjectId } from 'mongoose';
import { User } from 'src/users/users.schema';

export function generateJoinCode() {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

@Schema()
export class Team {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  ug: number; // 1,2,3,4

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  lead: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  members?: string[];

  @Prop({ required: true, default: generateJoinCode })
  joinCode: string;

  @Prop({ required: true, default: 0 })
  score: number;

  @Prop({ required: true, default: false })
  isCore: boolean;

  @Prop({ required: true, default: true })
  alive: boolean;

  @Prop({ required: true, default: Date.now })
  createdAt: Date;

  @Prop({ required: true, default: Date.now })
  updatedAt: Date;
}

export type TeamDocument = HydratedDocument<Team>;
export const TeamSchema = SchemaFactory.createForClass(Team);
