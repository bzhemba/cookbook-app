import {ApiBadRequestResponse, ApiBearerAuth, ApiNotFoundResponse, ApiOkResponse, ApiOperation,} from '@nestjs/swagger';
import {Body, Controller, Delete, Get, Param, Post, UseGuards,} from '@nestjs/common';
import {UserService} from './user.service';
import {UserDto} from './dto/user.dto';
import {CreateUserDto} from './dto/create-user.dto';
import {JwtAuthGuard} from '../auth/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {
  }

  @ApiOperation({ summary: 'Create user' })
  @ApiNotFoundResponse()
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserDto })
  @Post()
  async createUser(@Body() body: CreateUserDto) {
    await this.userService.createUser(body);
  }

  @ApiOperation({ summary: 'Get user by id' })
  @ApiNotFoundResponse()
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserDto })
  @Get(':id')
  async getById(@Param('id') id: number) {
    const user = await this.userService.getById(id);
    return user;
  }

  @ApiOperation({ summary: 'Get user by username' })
  @ApiNotFoundResponse()
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserDto })
  @Get('/username/:username')
  async getByUsername(@Param('username') username: string) {
    return await this.userService.getByUsername(username);
  }

  @ApiOperation({ summary: 'Delete user by id' })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiBearerAuth()
  @Delete(':id')
  async delete(@Param('id') id: number) {
    await this.userService.delete(id);
  }
}
