import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import {Ingredient} from "../entities/ingredient.entity";
import {IngredientsService} from "../ingredients.service";
import {IngredientDto} from "../dto/ingredient.dto";
import {CreateIngredientDto} from "../dto/create-ingredient.dto";
import {AutoMapper, mapFrom} from "nestjsx-automapper";
import {ImageDto} from "../../shared/dtos/image.dto";
import {Recipe} from "../../recipes/entities/recipe.entity";
import {RecipeDto} from "../../recipes/dto/recipe.dto";
import {Image} from "../../shared/entities/image.entity";

@Resolver('Ingredient')
export class IngredientResolver {
    constructor(private readonly ingredientService: IngredientsService, private readonly mapper: AutoMapper) {
        mapper.createMap(Image, ImageDto);
        mapper.createMap(Recipe, RecipeDto);
        mapper.createMap(Ingredient, IngredientDto)
            .forMember(
                dest => dest.recipes,
                mapFrom(src => mapper.mapArray(src.recipes, RecipeDto, Recipe))
            );
    }

    @Query(() => IngredientDto, { name: 'ingredient' })
    async getIngredient(@Args('id', { type: () => ID }) id: number): Promise<IngredientDto> {
        const ingredient = await this.ingredientService.findOne(id);
        console.log(ingredient);
        return this.mapper.map(ingredient, IngredientDto);
    }

    @Query(() => [IngredientDto], { name: 'ingredients' })
    async getIngredients(): Promise<IngredientDto[]> {
        const ingredients = await this.ingredientService.findAll();
        return this.mapper.mapArray(ingredients, IngredientDto);
    }

    @Mutation(() => IngredientDto)
    async createIngredient(@Args('input') input: CreateIngredientDto) {
        return this.ingredientService.create(input);
    }
}