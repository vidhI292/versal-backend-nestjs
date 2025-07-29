import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import googleOauthConfig from './config/google-oauth.config';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service'; // Import UserService

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy as any, 'google') {
  constructor(
    @Inject(googleOauthConfig.KEY)
    private googleConfiguration: ConfigType<typeof googleOauthConfig>,

    private readonly authService: AuthService,

    private readonly userService: UserService, // Inject UserService
  ) {
    super({
      clientID: googleConfiguration.clientID,
      clientSecret: googleConfiguration.clientSecret,
      callbackURL: googleConfiguration.callbackURL,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: Function,
  ) {
    const email = profile.emails?.[0]?.value;
    const name = profile.displayName || profile.name?.givenName || 'Unknown';

    if (!email) {
      return done(new Error('No email found in Google profile'), null);
    }

    let user = await this.userService.getUserByEmail(email); //  Now it works

    if (!user) {
      user = await this.userService.createUserWithGoogle(email, name); // You must create this method in UserService
    }

    done(null, user);
  }
}
