import {
  ApiBadRequestResponse,
  ApiBearerAuth, ApiNotFoundResponse, ApiOkResponse,
  ApiOperation, ApiQuery,
  ApiTags, ApiUnauthorizedResponse
} from "@nestjs/swagger";
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseFilters,
  UseGuards
} from "@nestjs/common";
import { RecipesService } from "./recipes.service";
import { Request } from "express";
import {RecipeDto} from "./dto/recipe.dto";
import {CreateRecipeDto} from "./dto/create-recipe-dto";
import {UpdateRecipeDto} from "./dto/update-recipe-dto";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import { EventEmitter2 } from '@nestjs/event-emitter';
import {HttpExceptionFilter} from "../shared/ExceptionFilter";
import {PaginatedResultDto} from "../shared/dtos/paginated-result.dto";
import {PaginationDto} from "../shared/dtos/pagination.dto";

@ApiTags('recipes')
@Controller('recipes')
@UseFilters(new HttpExceptionFilter())
export class RecipesController {
  constructor(private readonly recipeService: RecipesService, private eventEmitter: EventEmitter2) {}

  @ApiOperation({summary: 'Get recipe by text'})
  @ApiOkResponse({ type: RecipeDto })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @Get(':text')
  async getRecipeByText(@Param('text') text: string) {
    return await this.recipeService.getByText(text);
  }

  @Get('/suggestions/:text')
  @ApiOkResponse({type: [String] })
  @ApiBadRequestResponse()
  async getSuggestions(@Param('text') text: string) {
    return await this.recipeService.getSuggestions(text);
  }

  @ApiOperation({summary: 'Get all recipes'})
  @ApiOkResponse({ type: PaginatedResultDto<RecipeDto> })
  @ApiBadRequestResponse()
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @Get()
  async getAllRecipes(@Query() paginationDto: PaginationDto) {
    return await this.recipeService.getAll(paginationDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({summary: 'Create new recipe'})
  @ApiOkResponse({type: RecipeDto })
  @ApiBadRequestResponse()
  @ApiUnauthorizedResponse()
  @ApiNotFoundResponse()
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
  @ApiOkResponse({type: RecipeDto })
  @ApiBadRequestResponse()
  @ApiUnauthorizedResponse()
  @ApiNotFoundResponse()
  @Patch(':id')
  async updateRecipe(@Param('id') id: number, @Body() updateProjectDto : UpdateRecipeDto, @Req() request: Request) {
     await this.recipeService.update(request.oidc.user?.nickname, id, updateProjectDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({summary: 'Delete recipe by id'})
  @ApiOkResponse({type: RecipeDto })
  @ApiBadRequestResponse()
  @ApiUnauthorizedResponse()
  @ApiNotFoundResponse()
  @Delete(':id')
  async deleteRecipe(@Param('id') id: number, @Req() request: Request) {
    await this.recipeService.delete(request.oidc.user?.nickname, id);
  }
}