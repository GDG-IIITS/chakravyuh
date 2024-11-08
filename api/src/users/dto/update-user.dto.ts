import { PartialType } from '@nestjs/swagger';
import { AdminCreateUserDto, ICreateUserDto } from './create-user.dto';

export class IUpdateUserDto extends PartialType(ICreateUserDto) {
  emailVerified?: boolean;
  emailConfirmedAt?: Date;
}

export class AdminUpdateUserDto extends PartialType(AdminCreateUserDto) {}
