import { ApiProperty } from '@nestjs/swagger';
import mongoose, { ObjectId } from 'mongoose';
import { UserProfile } from '../entities/user-profile.entity';

export class UserProfileResDto {
  @ApiProperty({
    type: mongoose.Schema.Types.ObjectId,
    example: '666bd6340b338dabebaa23fa',
  })
  _id: ObjectId | string;
  fullName: string;
  profile: UserProfile;
}
