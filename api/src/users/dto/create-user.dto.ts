export class ICreateUserDto {
  email?: string;
  hashedPassword?: string;
  fullName: string;
  role?: string;
  ug: number;
  emailVerified?: boolean;
  isActive?: boolean;
}

export class AdminCreateUserDto {
  email?: string;
  password?: string;
  fullName: string;
  role?: string;
}
