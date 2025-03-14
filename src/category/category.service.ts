import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CategoryDto } from './dto/category.dto';
import { Recipe } from '../recipes/entities/recipe.entity';

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
        @InjectRepository(Recipe)
        private readonly recipeRepository: Repository<Recipe>,
    ) {}


    async create(categoryDto: CategoryDto): Promise<Category> {
        const recipes = await Promise.all(
            categoryDto.recipes.map(async (recipeDto) => {
                const recipe = await this.recipeRepository.findOneBy({ id: recipeDto.id });
                if (!recipe) {
                    throw new NotFoundException(`Recipe with id '${recipeDto.id}' not found`);
                }
                return recipe;
            }),
        );

        const category = new Category();
        category.categoryTitle = categoryDto.categoryTitle;
        category.recipes = recipes;

        return this.categoryRepository.save(category);
    }

    async findAll(): Promise<Category[]> {
        return this.categoryRepository.find({ relations: ['recipes'] });
    }

    async findOne(id: number): Promise<Category> {
        const category = await this.categoryRepository.findOne({
            where: { id },
            relations: ['recipes'],
        });
        if (!category) {
            throw new NotFoundException(`Category with id '${id}' not found`);
        }
        return category;
    }

    async update(id: number, categoryDto: CategoryDto): Promise<Category> {
        const category = await this.categoryRepository.findOneBy({ id });
        if (!category) {
            throw new NotFoundException(`Category with id '${id}' not found`);
        }

        const recipes = await Promise.all(
            categoryDto.recipes.map(async (recipeDto) => {
                const recipe = await this.recipeRepository.findOneBy({ id: recipeDto.id });
                if (!recipe) {
                    throw new NotFoundException(`Recipe with id '${recipeDto.id}' not found`);
                }
                return recipe;
            }),
        );

        category.categoryTitle = categoryDto.categoryTitle;
        category.recipes = recipes;

        return this.categoryRepository.save(category);
    }

    async remove(id: number): Promise<void> {
        const category = await this.categoryRepository.findOneBy({ id });
        if (!category) {
            throw new NotFoundException(`Category with id '${id}' not found`);
        }
        await this.categoryRepository.remove(category);
    }
}