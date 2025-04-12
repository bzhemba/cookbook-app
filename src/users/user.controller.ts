import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags, ApiUnauthorizedResponse
} from "@nestjs/swagger";
import {Body, Controller, Delete, Get, Param, Patch, Post, Req, UseFilters, UseGuards} from "@nestjs/common";
import { UserService } from "./user.service";
import { AutoMapper } from "nestjsx-automapper";
import { User } from "./entities/user.entity";
import { UserDto } from "./dto/user.dto";
import {CreateUserDto} from "./dto/create-user.dto";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {HttpExceptionFilter} from "../shared/ExceptionFilter";

@ApiTags('user')
@Controller('users')
@UseFilters(new HttpExceptionFilter())
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(
      private readonly userService: UserService,
      private readonly mapper: AutoMapper) {
    mapper.createMap(User, UserDto);
  }
  @ApiOperation({summary: 'Get user by id'})

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiNotFoundResponse()
  @ApiOkResponse({ type: UserDto })
  @ApiBadRequestResponse()
  @ApiUnauthorizedResponse()
  @Post()
  async createUser(@Body() body: CreateUserDto) {
    await this.userService.createUser(body);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({summary: 'Get user by id'})
  @ApiNotFoundResponse()
  @ApiOkResponse({ type: UserDto })
  @ApiBadRequestResponse()
  @ApiUnauthorizedResponse()
  @Get(':id')
  async getById(@Param('id') id: number) {
    const user = await this.userService.getById(id);
    return this.mapper.map(user, UserDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({summary: 'Get all users'})
  @ApiNotFoundResponse()
  @ApiOkResponse({ type: UserDto })
  @ApiBadRequestResponse()
  @ApiUnauthorizedResponse()
  @Get()
  async getAll() {
    const users = await this.userService.getAll();
    return this.mapper.mapArray(users, UserDto);
  }

  @ApiOperation({summary: 'Delete user by id'})
  @ApiBadRequestResponse()
  @ApiUnauthorizedResponse()
  @ApiNotFoundResponse()
  @Delete(':id')
  async delete(@Param('id') id: number) {
    await this.userService.delete(id);
  }
}