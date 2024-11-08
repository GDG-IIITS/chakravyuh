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
import { URoles } from '../users.schema';

@ApiTags('users')
@Controller('users')
@Roles(URoles.superuser, URoles.admin)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: '[ADMIN] Create a user' })
  async create(@Body() createUserDto: ICreateUserDto) {
    return this.usersService.icreate(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: '[ADMIN] Get all users' })
  async findAll() {
    return this.usersService.findAll();
  }

  @Patch(':id')
  @ApiOperation({ summary: '[ADMIN] Update a user' })
  update(@Param('id') id: string, @Body() updateUserDto: IUpdateUserDto) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '[ADMIN] Delete a user' })
  remove(@Param('id') id: string) {
    return this.usersService.removeUser(id);
  }
}
