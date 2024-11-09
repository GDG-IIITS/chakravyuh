import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

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

  @Prop({ required: true })
  lead: string;

  @Prop({ required: true })
  members: string[];

  @Prop({ required: true, default: generateJoinCode })
  joinCode: string;

  @Prop({ required: true, default: 0 })
  score: number;

  @Prop({ required: true, default: true })
  alive: boolean;

  @Prop({ required: true, default: Date.now })
  createdAt: Date;

  @Prop({ required: true, default: Date.now })
  updatedAt: Date;
}

export type TeamDocument = HydratedDocument<Team>;
export const TeamSchema = SchemaFactory.createForClass(Team);
