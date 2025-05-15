import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserDto } from '../dto/user.dto';
import { UserService } from '../user.service';
import { AutoMapper } from 'nestjsx-automapper';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';

@Resolver(() => UserDto)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly mapper: AutoMapper,
  ) {
    mapper.createMap(User, UserDto);
  }

  @Mutation(() => UserDto, { description: 'Create new user' })
  async createUser(
    @Args('input') createUserDto: CreateUserDto,
  ): Promise<UserDto> {
    const user = await this.userService.createUser(createUserDto);
    return this.mapper.map(user, UserDto);
  }

  @Query(() => UserDto, { description: 'Get user by ID' })
  async getUser(
    @Args('id', { type: () => Number }) id: number,
  ): Promise<UserDto> {
    const user = await this.userService.getById(id);
    return this.mapper.map(user, UserDto);
  }

  @Query(() => [UserDto], { description: 'Get all users' })
  async getAllUsers(): Promise<UserDto[]> {
    const users = await this.userService.getAll();
    return this.mapper.mapArray(users, UserDto);
  }

  @Mutation(() => Boolean, { description: 'Delete user by ID' })
  async deleteUser(
    @Args('id', { type: () => Number }) id: number,
  ): Promise<boolean> {
    await this.userService.delete(id);
    return true;
  }
}
