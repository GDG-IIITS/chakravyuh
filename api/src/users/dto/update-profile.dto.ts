import { UserProfile } from '../entities/user-profile.entity';

export class UpdateProfileDto {
  fullName?: string;
  profile?: UserProfile;
}
