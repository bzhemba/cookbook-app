import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ingredient } from './entities/ingredient.entity';
import { IngredientDto } from './dto/ingredient.dto';
import { Image } from '../shared/entities/image.entity';
import { Recipe } from '../recipes/entities/recipe.entity';
import {CreateIngredientDto} from "./dto/create-ingredient.dto";
import {PaginationDto} from "../shared/dtos/pagination.dto";
import {PaginatedResultDto} from "../shared/dtos/paginated-result.dto";

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


    async create(ingredientDto: CreateIngredientDto): Promise<Ingredient> {
        const image = await this.imageRepository.findOneBy({ id: ingredientDto.imageId });

        const ingredient = new Ingredient();
        ingredient.name = ingredientDto.name;
        ingredient.imageData = image ? image : undefined;

        return this.ingredientRepository.save(ingredient);
    }

    async getAll(paginationDto: PaginationDto): Promise<PaginatedResultDto<Ingredient>> {
        const { page, limit } = paginationDto;
        const [ingredients, total] = await this.ingredientRepository.findAndCount({
            skip: (page - 1) * limit,
            take: limit,
        });

        const lastPage = Math.ceil(total / limit);
        const nextPage = page < lastPage ? page + 1 : null;
        const prevPage = page > 1 ? page - 1 : null;

        return {
            data: ingredients,
            meta: {
                total,
                page,
                limit,
                lastPage,
            },
            links: {
                first: `/ingredients?page=1&limit=${limit}`,
                previous: prevPage ? `/ingredients?page=${prevPage}&limit=${limit}` : undefined,
                next: nextPage ? `/ingredients?page=${nextPage}&limit=${limit}` : undefined,
                last: `/ingredients?page=${lastPage}&limit=${limit}`,
            },
        };
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

        const image = await this.imageRepository.findOneBy({ id: ingredientDto.imageData?.id });
        if (!image) {
            throw new NotFoundException(`Image with id '${ingredientDto.imageData?.id}' not found`);
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