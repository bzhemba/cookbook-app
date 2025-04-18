import { Resolver, Query, Mutation, Args, ID, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import {EventEmitter2} from "@nestjs/event-emitter";
import {RecipeDto} from "../dto/recipe.dto";
import {RecipesService} from "../recipes.service";
import {JwtAuthGuard} from "../../auth/jwt-auth.guard";
import {CreateRecipeDto} from "../dto/create-recipe-dto";
import {UpdateRecipeDto} from "../dto/update-recipe-dto";
import {PaginationDto} from "../../shared/dtos/pagination.dto";

@Resolver(() => RecipeDto)
export class RecipeResolver {
    constructor(
        private readonly recipeService: RecipesService,
        private eventEmitter: EventEmitter2,
    ) {}
    
    @Query(() => RecipeDto, { name: 'recipe' })
    async getRecipeByText(@Args('text') text: string) {
        return this.recipeService.getByText(text);
    }

    @Query(() => [RecipeDto], { name: 'recipes' })
    async getAllRecipes(@Args('input') input: PaginationDto) {
        return this.recipeService.getAll(input);
    }

    @Query(() => [String], { name: 'recipeSuggestions' })
    async getSuggestions(@Args('text') text: string) {
        return this.recipeService.getSuggestions(text);
    }

    @Mutation(() => RecipeDto)
    async createRecipe(@Args('input') input: CreateRecipeDto) {
        const recipe = await this.recipeService.create(input);
        this.eventEmitter.emit('recipes', {
            type: 'RECIPE_CREATED',
            data: recipe,
        });
        return recipe;
    }

    @Mutation(() => RecipeDto)
    async updateRecipe(
        @Args('id', { type: () => ID }) id: number,
        @Args('input') input: UpdateRecipeDto,
        @Args('authorNickname') authorNickname: string,
    ) {
        return this.recipeService.update(authorNickname, id, input);
    }

    @Mutation(() => Boolean)
    @UseGuards(JwtAuthGuard)
    async deleteRecipe(
        @Args('id', { type: () => ID }) id: number,
        @Args('authorNickname') authorNickname: string,
    ) {
        await this.recipeService.delete(authorNickname, id);
        return true;
    }
}