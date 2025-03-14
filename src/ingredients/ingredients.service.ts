import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ingredient } from './entities/ingredient.entity';
import { IngredientDto } from './dto/ingredient.dto';
import { Image } from '../shared/entities/image.entity';
import { Recipe } from '../recipes/entities/recipe.entity';

@Injectable()
export class IngredientsService {
    constructor(
        @InjectRepository(Ingredient)
        private readonly ingredientRepository: Repository<Ingredient>,
        @InjectRepository(Image)
        private readonly imageRepository: Repository<Image>,
        @InjectRepository(Recipe)
        private readonly recipeRepository: Repository<Recipe>,
    ) {}


    async create(ingredientDto: IngredientDto): Promise<Ingredient> {
        const image = await this.imageRepository.findOneBy({ id: ingredientDto.imageData.id });
        if (!image) {
            throw new NotFoundException(`Image with id '${ingredientDto.imageData.id}' not found`);
        }

        const recipes = await Promise.all(
            ingredientDto.recipes.map(async (recipeDto) => {
                const recipe = await this.recipeRepository.findOneBy({ id: recipeDto.id });
                if (!recipe) {
                    throw new NotFoundException(`Recipe with id '${recipeDto.id}' not found`);
                }
                return recipe;
            }),
        );

        const ingredient = new Ingredient();
        ingredient.name = ingredientDto.name;
        ingredient.amount = ingredientDto.amount;
        ingredient.imageData = image;
        ingredient.recipes = recipes;

        return this.ingredientRepository.save(ingredient);
    }

    async findAll(): Promise<Ingredient[]> {
        return this.ingredientRepository.find({ relations: ['imageData', 'recipes'] });
    }

    async findOne(id: number): Promise<Ingredient> {
        const ingredient = await this.ingredientRepository.findOne({
            where: { id },
            relations: ['imageData', 'recipes'],
        });
        if (!ingredient) {
            throw new NotFoundException(`Ingredient with id '${id}' not found`);
        }
        return ingredient;
    }

    async update(id: number, ingredientDto: IngredientDto): Promise<Ingredient> {
        const ingredient = await this.ingredientRepository.findOneBy({ id });
        if (!ingredient) {
            throw new NotFoundException(`Ingredient with id '${id}' not found`);
        }

        const image = await this.imageRepository.findOneBy({ id: ingredientDto.imageData.id });
        if (!image) {
            throw new NotFoundException(`Image with id '${ingredientDto.imageData.id}' not found`);
        }

        const recipes = await Promise.all(
            ingredientDto.recipes.map(async (recipeDto) => {
                const recipe = await this.recipeRepository.findOneBy({ id: recipeDto.id });
                if (!recipe) {
                    throw new NotFoundException(`Recipe with id '${recipeDto.id}' not found`);
                }
                return recipe;
            }),
        );

        ingredient.name = ingredientDto.name;
        ingredient.amount = ingredientDto.amount;
        ingredient.imageData = image;
        ingredient.recipes = recipes;

        return this.ingredientRepository.save(ingredient);
    }

    async remove(id: number): Promise<void> {
        const ingredient = await this.ingredientRepository.findOneBy({ id });
        if (!ingredient) {
            throw new NotFoundException(`Ingredient with id '${id}' not found`);
        }
        await this.ingredientRepository.remove(ingredient);
    }
}