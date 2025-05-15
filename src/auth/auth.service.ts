import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/user.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { Session } from 'express-openid-connect';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    username: string,
    pass: string,
    email: string,
  ): Promise<{ message: string }> {
    const hashedPassword = await bcrypt.hash(pass, 10);

    const user = new CreateUserDto();
    user.username = username;
    user.email = email;
    user.password = hashedPassword;
    await this.userService.createUser(user);

    return { message: 'User registered successfully' };
  }

  async logIn(
    username: string,
    pass: string,
    session: Session,
  ): Promise<{ access_token: string }> {
    const user = await this.userService.getByUsername(username);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(pass, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    const payload = { sub: user.id, username: user.username };
    session.user = { username };
    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
    };
  }
}
