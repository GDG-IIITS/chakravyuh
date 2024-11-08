import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as argon2 from 'argon2';
import { Model, Types as mongooseTypes } from 'mongoose';
import { toUname } from 'src/utils/string';
import { appConfig, defaults } from '../app.config';
import { ICreateUserDto } from './dto/create-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { IUpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './users.schema';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @InjectModel(User.name) private readonly usersModel: Model<UserDocument>,
  ) {}

  async onModuleInit() {
    await this.createSuperUser(
      appConfig.superUser.name,
      appConfig.superUser.email,
      appConfig.superUser.pass,
    );
  }

  async generateUsername(fullName: string) {
    const uname = toUname(fullName);
    const users = await this.usersModel.find({ uname: uname }).exec();
    if (users.length === 0) return uname;
    const randStr = Math.random().toString(36).substring(2, 6);
    return `${uname}-${randStr}${users.length + 1}`;
  }

  async findIdByUname(uname: string) {
    return await this.usersModel
      .findOne({ uname: uname })
      .select('_id uname')
      .exec();
  }

  async icreate(createUserDto: ICreateUserDto): Promise<UserDocument> {
    const now = new Date();
    const user = new this.usersModel({
      _id: new mongooseTypes.ObjectId().toHexString(),
      ...createUserDto,
      joined: now,
      lastLogin: now,
      uname: await this.generateUsername(createUserDto.fullName),
    });
    return await user.save();
  }

  async findAll() {
    console.log('HERE');
    return await this.usersModel.find().exec();
  }

  async findById(id: string) {
    return await this.usersModel.findById(id);
  }

  async findProfileById(id: string) {
    return await this.usersModel.findById(id, {
      fullName: 1,
      profile: 1,
    });
  }

  async updateProfileById(id: string, profile: UpdateProfileDto) {
    const user = await this.findById(id);
    console.log(profile);
    if (profile.fullName) user.fullName = profile.fullName;
    if (profile.profile) user.profile = profile.profile;
    await user.save();
    console.log(user);
    return { message: 'Profile succesfuly updated' };
  }

  async findByEmail(email: string) {
    return await this.usersModel.findOne({ email: email });
  }

  async checkEmailExists(email: string) {
    return (await this.usersModel.countDocuments({ email: email }).exec()) > 0;
  }

  async updateUser(id: string, updateUserDto: IUpdateUserDto) {
    return await this.usersModel.findByIdAndUpdate(id, updateUserDto, {
      new: true,
    });
  }

  async createSuperUser(name: string, email: string, password: string) {
    console.log('Creating Superuser...');
    if (await this.checkEmailExists(email)) {
      console.log(`Superuser <${email}> already exists`);
      return;
    }
    if (
      appConfig.nodeEnv === 'production' &&
      (email === defaults.superUser.email ||
        password === defaults.superUser.pass)
    ) {
      throw new Error(
        'Cannot create superuser with default email/password in production',
      );
    }
    await this.icreate({
      fullName: name,
      email: email,
      hashedPassword: await argon2.hash(password),
      role: 'superuser',
    });
    console.log('Superuser created successfully!');
  }

  async getOgSuperUser() {
    return await this.usersModel
      .findOne({ role: 'superuser' })
      .sort({ joined: 1 })
      .exec();
    // get the oldest created superuser on the platform
  }

  async removeUser(id: string) {
    return await this.usersModel.findByIdAndDelete(id);
  }
}
