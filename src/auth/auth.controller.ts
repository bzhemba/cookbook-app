import { Body, Controller, Get, Post, Session } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { SignInDto } from './dto/sign-in.dto';

import { SessionResponseDto } from './dto/session-response.dto';
import { UserSession } from './interface/session.interfaces';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('check-auth')
  checkAuth(@Session() session: UserSession): SessionResponseDto {
    return {
      isAuthenticated: !!session.user,
      user: session.user,
    };
  }

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
