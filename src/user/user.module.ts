import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]),
JwtModule.register({}),AuthModule,  forwardRef(() => AuthModule), 
],
  providers: [UserService],
  controllers: [UserController],
  exports:[UserService]
  
})
export class UserModule {}
