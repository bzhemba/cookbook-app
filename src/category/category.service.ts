import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CategoryDto } from './dto/category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(categoryDto: CategoryDto) {
    const category = new Category();
    category.categoryTitle = categoryDto.categoryTitle;

    return this.categoryRepository.save(category);
  }

  async findAll(): Promise<Category[]> {
    return this.categoryRepository.find();
  }

  async findOne(id: number) {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['recipes'],
    });
    if (!category) {
      throw new NotFoundException(`Category with id '${id}' not found`);
    }
    return category;
  }

  async update(id: number, categoryDto: CategoryDto) {
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category) {
      throw new NotFoundException(`Category with id '${id}' not found`);
    }

    category.categoryTitle = categoryDto.categoryTitle;

    return this.categoryRepository.save(category);
  }

  async remove(id: number) {
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category) {
      throw new NotFoundException(`Category with id '${id}' not found`);
    }
    await this.categoryRepository.remove(category);
  }
}
