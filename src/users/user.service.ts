import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";

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

  async findAll() {
    return await this.userRepository.find();
  }

  async delete(id: number) {
    await this.userRepository.delete(id);
  }
}