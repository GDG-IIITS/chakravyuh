import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ICreateUserDto } from '../dto/create-user.dto';
import { UsersService } from '../users.service';
// import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/roles.decorator';
import { IUpdateUserDto } from '../dto/update-user.dto';
import { URoles, UserDocument } from '../users.schema';

@ApiTags('users')
@Controller('users')
@Roles(URoles.superuser)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: '[ADMIN] Create a user' })
  async create(@Body() createUserDto: ICreateUserDto): Promise<UserDocument> {
    return this.usersService.icreate(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: '[ADMIN] Get all users' })
  async findAll(): Promise<UserDocument[]> {
    return this.usersService.findAll();
  }

  @Patch(':id')
  @ApiOperation({ summary: '[ADMIN] Update a user' })
  update(
    @Param('id') id: string,
    @Body() updateUserDto: IUpdateUserDto,
  ): Promise<UserDocument> {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '[ADMIN] Delete a user' })
  remove(@Param('id') id: string): Promise<UserDocument> {
    return this.usersService.removeUser(id);
  }
}
