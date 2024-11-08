import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class EmailVerificationToken {
  @Prop({ required: true, index: true, unique: true })
  userId: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, unique: true })
  token: string;

  @Prop({ required: true })
  expiresAt: Date;
}

export type EmailVerificationTokenDocument =
  HydratedDocument<EmailVerificationToken>;
export const EmailVerificationTokenSchema = SchemaFactory.createForClass(
  EmailVerificationToken,
);
