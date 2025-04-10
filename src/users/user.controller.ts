import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiForbiddenResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags
} from "@nestjs/swagger";
import {Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards} from "@nestjs/common";
import { UserService } from "./user.service";
import { AutoMapper } from "nestjsx-automapper";
import { User } from "./entities/user.entity";
import { UserDto } from "./dto/user.dto";
import {CreateUserDto} from "./dto/create-user.dto";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";

@ApiTags('user')
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly mapper: AutoMapper) {
    }

    @ApiOperation({summary: 'Create user'})
    @ApiNotFoundResponse()
    @ApiBearerAuth()
    @ApiOkResponse({ type: UserDto })
    @Post()
    async createUser(@Body() body: CreateUserDto) {
        await this.userService.createUser(body);
    }

    @ApiOperation({summary: 'Get user by id'})
    @ApiNotFoundResponse()
    @ApiBearerAuth()
    @ApiOkResponse({ type: UserDto })
    @Get(':id')
    async getById(@Param('id') id: number) {
        const user = await this.userService.getById(id);
        return this.mapper.map(user, UserDto);
    }

    @ApiOperation({summary: 'Get all users'})
    @ApiForbiddenResponse()
    @ApiBearerAuth()
    @ApiOkResponse({ type: UserDto, isArray: true })
    @Get()
    async findAll() {
        const users = await this.userService.findAll();
        return this.mapper.mapArray(users, UserDto);
    }

    @ApiOperation({summary: 'Delete user by id'})
    @ApiBadRequestResponse()
    @ApiNotFoundResponse()
    @ApiBearerAuth()
    @Delete(':id')
    async delete(@Param('id') id: number) {
        await this.userService.delete(id);
    }
}