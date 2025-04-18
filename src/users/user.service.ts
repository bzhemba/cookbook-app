import {ConflictException, Injectable, NotFoundException} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
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
    const username = userDto.username;
    const email = userDto.email;
    const existingUser = await this.userRepository.findOneBy({ username });
    if (existingUser != null) {
      throw new ConflictException(`User with username ${username} already exists`);
    }

    const existingEmail = await this.userRepository.findOneBy({ email });
    if (existingEmail != null) {
      throw new ConflictException(`Account with this email ${existingEmail} already exists`);
    }

    user.username = username;
    user.password = userDto.password;
    user.email = email;
    return await this.userRepository.save(user);
  }

  async delete(id: number) {
    await this.userRepository.delete(id);
  }
}