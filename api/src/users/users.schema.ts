import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UserProfile as UserProfileEntity } from './entities/user-profile.entity';

@Schema()
export class UserProfile extends UserProfileEntity {}

export enum URoles {
  superuser = 'superuser',
  admin = 'admin',
  user = 'user',
}

@Schema()
export class User {
  @Prop({ required: true })
  _id: string;

  @Prop({ required: true, index: true, unique: true })
  uname: string;

  @Prop({ required: true, index: true, unique: true })
  email: string;

  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true })
  hashedPassword: string;

  @Prop({
    required: true,
    enum: URoles,
    default: URoles.user,
  })
  role: string;

  @Prop()
  profile: UserProfile;

  @Prop({ required: true, default: Date })
  joined: Date;

  @Prop({ required: true, default: Date })
  lastLogin: Date;

  @Prop({ required: true, default: true })
  isActive: boolean;

  @Prop({ required: false })
  inactiveReason: string;

  @Prop({ required: true, default: false })
  emailVerified: boolean;

  @Prop({ required: false })
  emailConfirmedAt: Date;
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);
