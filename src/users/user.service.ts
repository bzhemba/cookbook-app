import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
import {UserDto} from "./dto/user.dto";
import {Image} from "../shared/entities/image.entity";
import {CreateUserDto} from "./dto/create-user.dto";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async getById(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (user === null) {
      throw new NotFoundException();
    }

    return user;
  }

  async getByUsername(username: string) {
    const user = await this.userRepository.findOneBy({ username });
    if (user === null) {
      throw new NotFoundException();
    }

    return user;
  }

  async getAll() {
    return await this.userRepository.find();
  }

  async createUser(userDto: CreateUserDto) {

    const user = new User();
    user.username = userDto.username;
    user.password = userDto.password;
    user.email = userDto.email;
    return await this.userRepository.save(user);
  }

  async delete(id: number) {
    await this.userRepository.delete(id);
  }
}