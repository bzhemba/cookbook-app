import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags
} from "@nestjs/swagger";
import {Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards} from "@nestjs/common";
import { RecipesService } from "./recipes.service";
import { Request } from "express";
import {RecipeDto} from "./dto/recipe.dto";
import {CreateRecipeDto} from "./dto/create-recipe-dto";
import {UpdateRecipeDto} from "./dto/update-recipe-dto";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import { EventEmitter2 } from '@nestjs/event-emitter';

@ApiTags('recipes')
@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipeService: RecipesService, private eventEmitter: EventEmitter2) {}

  @ApiOperation({summary: 'Get recipe by text'})
  @ApiNotFoundResponse()
  @ApiOkResponse({ type: RecipeDto })
  @Get(':text')
  async getRecipeByText(@Param('text') text: string) {
    return await this.recipeService.getByText(text);
  }

  @Get('/suggestions/:text')
  async getSuggestions(@Param('text') text: string) {
    return await this.recipeService.getSuggestions(text);
  }

  @ApiOperation({summary: 'Get all recipes'})
  @ApiOkResponse({ type: RecipeDto, isArray: true })
  @Get()
  async getAllRecipes() {
    return await this.recipeService.getAll();
  }

  @ApiBearerAuth()
  @ApiOperation({summary: 'Create new recipe'})
  @ApiOkResponse({ type: RecipeDto })
  @ApiNotFoundResponse()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createRecipeDto : CreateRecipeDto) {
    const recipe = await this.recipeService.create(createRecipeDto);
    this.eventEmitter.emit('recipes', {
      type: 'RECIPE_CREATED',
      data: recipe
    });
    return recipe
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({summary: 'Update recipe'})
  @ApiNotFoundResponse()
  @ApiOkResponse({ type: RecipeDto })
  @ApiBearerAuth()
  @Patch(':id')
  async updateRecipe(@Param('id') id: number, @Body() updateProjectDto : UpdateRecipeDto, @Req() request: Request) {
     await this.recipeService.update(request.oidc.user?.nickname, id, updateProjectDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({summary: 'Delete recipe by id'})
  @ApiForbiddenResponse()
  @ApiNotFoundResponse()
  @ApiBearerAuth()
  @Delete(':id')
  async deleteRecipe(@Param('id') id: number, @Req() request: Request) {
    await this.recipeService.delete(request.oidc.user?.nickname, id);
  }
}