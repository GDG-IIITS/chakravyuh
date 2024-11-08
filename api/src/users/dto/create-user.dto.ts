export class ICreateUserDto {
  email?: string;
  hashedPassword?: string;
  fullName: string;
  role?: string;
  githubId?: string;
  googleId?: string;
  emailVerified?: boolean;
}

export class AdminCreateUserDto {
  email?: string;
  password?: string;
  fullName: string;
  role?: string;
}
