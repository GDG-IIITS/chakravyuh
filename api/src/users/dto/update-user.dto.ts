import { ApiProperty, PartialType } from '@nestjs/swagger';
import { AdminCreateUserDto, ICreateUserDto } from './create-user.dto';
import { URoles } from '../users.schema';

export class IUpdateUserDto extends PartialType(ICreateUserDto) {
  emailVerified?: boolean;
  emailConfirmedAt?: Date;
  @ApiProperty({ enum: URoles })
  role?: string;
}

export class AdminUpdateUserDto extends PartialType(AdminCreateUserDto) {}
