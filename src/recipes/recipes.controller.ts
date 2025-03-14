import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags
} from "@nestjs/swagger";
import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { RecipesService } from "./recipes.service";
import { AutoMapper, mapFrom } from "nestjsx-automapper";
import { Auth0Guard } from "../auth/auth0.guard";
import { Request } from "express";
import {Recipe} from "./entities/recipe.entity";
import {RecipeDto} from "./dto/recipe.dto";
import {UserDto} from "../users/dto/user.dto";
import {User} from "../users/entities/user.entity";
import {RecipeTagDto} from "./dto/recipe-tag.dto";
import {CreateRecipeDto} from "./dto/create-recipe-dto";
import {UpdateRecipeDto} from "./dto/update-recipe-dto";

@ApiTags('recipes')
@Controller('recipes')
@UseGuards(Auth0Guard)
export class RecipesController {
  constructor(
      private readonly recipeService: RecipesService,
      private readonly mapper: AutoMapper) {
    mapper.createMap(User, UserDto)
    mapper.createMap(Recipe, RecipeDto)
        .forMember(dest => dest.tags, mapFrom(src => src.tags?.map(t => mapper.map(t, RecipeTagDto))))
        .forMember(dest => dest.createdByUser, mapFrom(src => mapper.map(src.createdByUser, UserDto)));
  }

  @ApiOperation({summary: 'Get recipe by id'})
  @ApiNotFoundResponse()
  @ApiOkResponse({ type: RecipeDto })
  @Get(':id')
  async getRecipeById(@Param('id') id: number) {
    const recipe = await this.recipeService.getById(id);
    return this.mapper.map(recipe, RecipeDto);
  }

  @ApiOperation({summary: 'Get all recipes'})
  @ApiOkResponse({ type: RecipeDto, isArray: true })
  @Get()
  async getAllRecipes() {
    const projectTags = await this.recipeService.getAll();
    return this.mapper.mapArray(projectTags, RecipeDto);
  }

  @UseGuards(Auth0Guard)
  @ApiBearerAuth()
  @ApiOperation({summary: 'Create new recipe'})
  @ApiOkResponse({ type: RecipeDto })
  @ApiNotFoundResponse()
  @Post()
  async create(@Body() createRecipeDto : CreateRecipeDto, @Req() request: Request) {
    const recipe = await this.recipeService.create(request['oidc'].user.nickname, createRecipeDto);
    return this.mapper.map(recipe, RecipeDto);
  }

  @UseGuards(Auth0Guard)
  @ApiBearerAuth()
  @ApiOperation({summary: 'Update recipe'})
  @ApiNotFoundResponse()
  @ApiOkResponse({ type: RecipeDto })
  @Patch(':id')
  async updateRecipe(@Param('id') id: number, @Body() updateProjectDto : UpdateRecipeDto, @Req() request: Request) {
    const recipe = await this.recipeService.update(request['oidc']?.user.nickname, id, updateProjectDto);
    return this.mapper.map(recipe, UpdateRecipeDto);
  }

  @UseGuards(Auth0Guard)
  @ApiBearerAuth()
  @ApiOperation({summary: 'Delete recipe by id'})
  @ApiForbiddenResponse()
  @ApiNotFoundResponse()
  @Delete(':id')
  async deleteRecipe(@Param('id') id: number, @Req() request: Request) {
    await this.recipeService.delete(request['oidc']?.user.nickname, id);
  }
}