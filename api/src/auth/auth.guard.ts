import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { UsersService } from 'src/users/users.service';
import { lucia } from './lucia';
import { IS_PUBLIC_KEY } from './public.decorator';

const EXTRA_PUBLIC_ROUTES = ['/metrics'];
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private userService: UsersService,
    private reflector: Reflector,
  ) {}

  async getUserSession(authCookie: string) {
    const { user, session } = await lucia.validateSession(authCookie);
    if (!session) {
      throw new UnauthorizedException('Invalid Session');
    }
    const userObj = await this.userService.findById(user.id);
    return { user: userObj, session };
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const url = context.switchToHttp().getRequest().url;
    if (isPublic || EXTRA_PUBLIC_ROUTES.includes(url)) {
      return true;
    }
    const request: Request = context.switchToHttp().getRequest();
    const { user, session } = await this.getUserSession(
      request.cookies[lucia.sessionCookieName],
    );
    request['user'] = user;
    request['session'] = session;
    return request['user'].isActive;
  }
}
