import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { UserProfileResDto } from '../dto/user-profile-res.dto';
import { UsersService } from '../users.service';

@ApiTags('self')
@Controller('self')
export class SelfUserController {
  constructor(private readonly usersService: UsersService) {}

  @Post('profile')
  @ApiOperation({ summary: 'Update own profile' })
  async updateProfile(@Body() profile: UpdateProfileDto, @Req() req: Request) {
    return await this.usersService.updateProfileById(req['user'].id, profile);
  }

  @Get('profile')
  @ApiOperation({ summary: 'Get user profile' })
  async getProfile(@Req() req: Request): Promise<UserProfileResDto> {
    return await this.usersService.findProfileById(req['user'].id);
  }
}
