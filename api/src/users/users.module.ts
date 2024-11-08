import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SelfUserController } from './controllers/self.controller';
import { UsersController } from './controllers/users.controller';
import { User, UserSchema } from './users.schema';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController, SelfUserController],
  providers: [UsersService],
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  exports: [UsersService],
})
export class UsersModule {}
