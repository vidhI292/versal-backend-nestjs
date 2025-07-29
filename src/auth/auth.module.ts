import { forwardRef, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { GoogleStrategy } from './google.strategy';
import { AuthController } from './auth.controller';
import { User } from 'src/user/entities/user.entity';
import { UserModule } from 'src/user/user.module';
import googleOauthConfig from './config/google-oauth.config';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'Key',
      signOptions: { expiresIn: '7d' },
    }),
    forwardRef(() => UserModule), 
    TypeOrmModule.forFeature([User]),
    ConfigModule.forFeature(googleOauthConfig),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, GoogleStrategy],
  exports: [AuthService, JwtModule],
  controllers: [AuthController],
})
export class AuthModule {}
