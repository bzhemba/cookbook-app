import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RecipeTag } from './entities/recipe-tag.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RecipeTagService {
  constructor(
    @InjectRepository(RecipeTag)
    private readonly recipeTagRepository: Repository<RecipeTag>,
  ) {}

  async getAll() {
    return await this.recipeTagRepository.find();
  }
}
