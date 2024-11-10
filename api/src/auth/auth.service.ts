import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as argon2 from 'argon2';
import { Response } from 'express';
import { generateIdFromEntropySize } from 'lucia';
import { Model } from 'mongoose';
import { TimeSpan, createDate } from 'oslo';
import { sha256 } from 'oslo/crypto';
import { encodeHex } from 'oslo/encoding';
import { appConfig } from 'src/app.config';
import { MailerService } from 'src/mailer/mailer.service';
import { UserDocument } from 'src/users/users.schema';
import { UsersService } from 'src/users/users.service';
import { getUg, getYear } from 'src/utils/string';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyResetPasswordDto } from './dto/verify-reset-password.dto';
import { lucia } from './lucia';
import { PasswordResetToken } from './schemas/password-reset.schema';
import { EmailVerificationToken } from './schemas/verify-email.schema';
@Injectable()
export class AuthService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly usersService: UsersService,
    @InjectModel(PasswordResetToken.name)
    private readonly passwordResetTokenModel: Model<PasswordResetToken>,
    @InjectModel(EmailVerificationToken.name)
    private readonly emailVerificationTokenModel: Model<EmailVerificationToken>,
  ) {}

  async createSessionCookie(userId: string, res: Response) {
    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    if (sessionCookie.attributes.secure)
      sessionCookie.attributes.sameSite = 'none';
    // NOTE: the value of maxAge given by lucia is in seconds, but res.cookie of express expects it in milliseconds
    sessionCookie.attributes.maxAge = 1000 * sessionCookie.attributes.maxAge;
    if (appConfig.setCookieDomain && appConfig.nodeEnv != 'localhost')
      sessionCookie.attributes.domain = appConfig.setCookieDomain;
    res.cookie(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );
  }

  async register(registerUserDto: RegisterUserDto): Promise<UserDocument> {
    if (await this.usersService.checkEmailExists(registerUserDto.email)) {
      throw new ForbiddenException('User with this email already exists');
    }

    if (!registerUserDto.email.endsWith('@iiits.in')) {
      throw new ForbiddenException(
        'Only @iiits.in email addresses are allowed',
      );
    }

    const year = getYear(registerUserDto.email);
    const ug = getUg(year);
    const hashedPassword = await argon2.hash(registerUserDto.password);
    return await this.usersService.icreate({
      email: registerUserDto.email,
      fullName: registerUserDto.fullName,
      hashedPassword: hashedPassword,
      ug: ug,
    });
  }

  async login(loginUserDto: LoginUserDto): Promise<UserDocument> {
    const user = await this.usersService.findByEmail(loginUserDto.email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const match = await argon2.verify(
      user.hashedPassword,
      loginUserDto.password,
    );
    if (!match) {
      throw new UnauthorizedException('Invalid email or password');
    }
    user.lastLogin = new Date();
    await user.save();
    return user;
  }

  async createPasswordResetToken(userId: string) {
    await this.passwordResetTokenModel.deleteMany({ userId: userId });
    const tokenId = generateIdFromEntropySize(25); // 40 character
    const tokenHash = encodeHex(
      await sha256(new TextEncoder().encode(tokenId)),
    );
    const passwordResetToken = new this.passwordResetTokenModel({
      userId: userId,
      tokenHash: tokenHash,
      expiresAt: createDate(new TimeSpan(2, 'h')),
    });
    await passwordResetToken.save();
    return tokenId;
  }

  async initPasswordReset(resetPasswordDto: ResetPasswordDto) {
    const user = await this.usersService.findByEmail(resetPasswordDto.email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const token = await this.createPasswordResetToken(user.id);
    const verificationUrl = resetPasswordDto.frontendBase + '?token=' + token;
    await this.mailerService.sendMail({
      recipients: [resetPasswordDto.email],
      subject: 'Password reset for chakravyuh Account',
      text: `Click on the link to reset your password: ${verificationUrl}`,
      html: `Click on the link to reset your password: <a href="${verificationUrl}">${verificationUrl}</a>`,
    });
    return { message: 'Password reset link sent to your email' };
  }

  async resetPassword(verifyResetPasswordDto: VerifyResetPasswordDto) {
    const tokenHash = encodeHex(
      await sha256(new TextEncoder().encode(verifyResetPasswordDto.token)),
    );
    const token = await this.passwordResetTokenModel.findOne({
      tokenHash: tokenHash,
    });
    if (!token) {
      throw new UnauthorizedException('Invalid or expired token');
    }
    if (token.expiresAt < new Date()) {
      throw new UnauthorizedException('Token expired');
    }
    const user = await this.usersService.findById(token.userId);
    if (!user) {
      throw new UnauthorizedException('User not found, or invalid token.');
    }
    const hashedPassword = await argon2.hash(verifyResetPasswordDto.password);
    await this.usersService.updateUser(user.id, {
      hashedPassword: hashedPassword,
    });
    await this.passwordResetTokenModel.findByIdAndDelete(token.id);
    return { message: 'Password reset successfully' };
  }

  async createEmailVerificationToken(userId: string, email: string) {
    await this.emailVerificationTokenModel.deleteMany({
      $or: [{ userId: userId }, { email: email }],
    });
    await this.emailVerificationTokenModel.deleteMany({ email: email });
    const tokenId = generateIdFromEntropySize(25); // 40 character
    const token = new this.emailVerificationTokenModel({
      token: tokenId,
      email: email,
      userId: userId,
      expiresAt: createDate(new TimeSpan(2, 'h')),
    });
    return await token.save();
  }

  async initEmailVerification(userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    if (user.emailVerified) {
      return { message: 'Email already verified' };
    }
    const token = await this.createEmailVerificationToken(userId, user.email);
    await this.mailerService.sendMail({
      recipients: [user.email],
      subject: 'Email Verification for Chakravyuh Account',
      text: `Token to verify your email (will expire soon!): ${token}`,
    });
    return { message: 'Email verification link sent to your email' };
  }

  async verifyEmail(token: string) {
    const emailToken = await this.emailVerificationTokenModel.findOne({
      token: token,
    });
    if (!emailToken) {
      throw new UnauthorizedException('Invalid or expired token');
    }
    if (emailToken.expiresAt < new Date()) {
      throw new UnauthorizedException('Token expired');
    }
    const user = await this.usersService.findById(emailToken.userId);
    if (user.email !== emailToken.email) {
      throw new UnauthorizedException('Invalid token');
    }
    if (user.emailVerified) {
      return { message: 'Email already verified' };
    }
    user.emailVerified = true;
    user.isActive = true;
    user.emailConfirmedAt = new Date();
    await user.save();
    return { message: 'Email verified successfully' };
  }
}
