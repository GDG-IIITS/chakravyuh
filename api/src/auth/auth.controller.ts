import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { VerifyResetPasswordDto } from './dto/verify-reset-password.dto';
import { lucia } from './lucia';
import { Public } from './public.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('/register')
  async register(
    @Body() registerUserDto: RegisterUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.register(registerUserDto);
    await this.authService.createSessionCookie(user.id, res);
    return user;
  }

  @Public()
  @Post('/login')
  async login(
    @Body() loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.login(loginUserDto);
    await this.authService.createSessionCookie(user.id, res);
    return user;
  }

  @Get('/me')
  async me(@Req() req: Request) {
    return req['user'];
  }

  @Public()
  @Post('/reset-password/init')
  async initPasswordReset(@Body() resetPasswordDto: ResetPasswordDto) {
    return await this.authService.initPasswordReset(resetPasswordDto);
  }

  @Public()
  @Post('/reset-password/verify')
  async resetPassword(@Body() verifyResetPasswordDto: VerifyResetPasswordDto) {
    return await this.authService.resetPassword(verifyResetPasswordDto);
  }

  @Post('/verify-email/init')
  async initEmailVerification(
    @Req() req: Request,
    @Body() emailVerificationDto: VerifyEmailDto,
  ) {
    return await this.authService.initEmailVerification(
      req['user'].id,
      emailVerificationDto.frontendBase,
    );
  }

  @Public()
  @Post('/verify-email/:token')
  async verifyEmail(@Param('token') token: string) {
    return await this.authService.verifyEmail(token);
  }

  @Delete('/logout')
  async logoutDevice(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    await lucia.invalidateSession(req['session'].id);
    const cookie = lucia.createBlankSessionCookie();
    console.log(cookie);
    res.cookie(cookie.name, cookie.value, cookie.attributes);
    return {
      message: 'Logged out',
    };
  }
}
