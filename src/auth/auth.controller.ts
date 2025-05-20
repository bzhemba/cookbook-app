import { Body, Controller, Post, Session } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { SignInDto } from './dto/sign-in.dto';
import { Session as UserSession } from 'express-openid-connect';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Sign in' })
  @Post('signIn')
  async signIn(@Body() body: SignInDto) {
    const { username, password, email } = body;
    return this.authService.signIn(username, password, email);
  }

  @ApiOperation({ summary: 'Log in' })
  @Post('logIn')
  async logIn(@Body() body: LoginDto, @Session() session: UserSession) {
    const { username, password } = body;
    return this.authService.logIn(username, password, session);
  }
}
