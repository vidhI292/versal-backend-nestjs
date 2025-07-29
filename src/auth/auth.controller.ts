import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody } from '@nestjs/swagger';
import { LoginDto } from 'src/user/dto/login.dto';
import { RequestWithUser } from 'src/types/expressRequestWithUser';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  // Registration
  @Post('register')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.userService.createUser(createUserDto);
  }

  // Login
  @Post('login')
  @UseGuards(AuthGuard('local'))
  @ApiBody({ type: LoginDto })
  login(@Req() req: RequestWithUser) {
    return {
      message: 'Login successful',
      token: this.authService.generateToken(req.user),
      user: req.user,
    };
  }

  // Google Login Redirect
  @Get('google/login')
  @UseGuards(AuthGuard('google'))
  async googleLogin() {
    // This redirects to Google OAuth
  }

  // Google OAuth Callback
  @Get('google/callback')
@UseGuards(AuthGuard('google'))
async googleCallback(@Req() req, @Res() res) {
  const response = await this.authService.loginWithGoogle(req.user);
  res.redirect(`http://localhost:3000?token=${response.accessToken}`);
}

}
