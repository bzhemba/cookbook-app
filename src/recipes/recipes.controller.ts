import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Query,
  Req,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { Request } from 'express';
import { RecipeDto } from './dto/recipe.dto';
import { CreateRecipeDto } from './dto/create-recipe-dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { HttpExceptionFilter } from '../shared/ExceptionFilter';
import { PaginatedResultDto } from '../shared/dtos/paginated-result.dto';
import { PaginationDto } from '../shared/dtos/pagination.dto';
import {
  Cache,
  CACHE_MANAGER,
  CacheKey,
  CacheTTL,
} from '@nestjs/cache-manager';
import { EtagInterceptor } from '../interceptors/etag.interceptor';
import { FilterRecipesDto } from './dto/filter-recipe.dto';

@Controller('recipes')
@CacheTTL(50)
@UseFilters(new HttpExceptionFilter())
export class RecipesController {
  constructor(
    private readonly recipeService: RecipesService,
    private eventEmitter: EventEmitter2,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @ApiOperation({ summary: 'Get recipe by text' })
  @ApiOkResponse({ type: RecipeDto })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @UseInterceptors(EtagInterceptor)
  @Get('/name/:text')
  @CacheKey('recipe_text_${{value:text}}')
  async getRecipeByText(@Param('text') text: string) {
    return await this.recipeService.getByText(text);
  }

  @ApiOperation({ summary: 'Get filtered recipes' })
  @Get('filter')
  @ApiQuery({ name: 'categories', type: [String], required: false })
  @ApiQuery({ name: 'tags', type: [String], required: false })
  @ApiQuery({ name: 'ingredients', type: [String], required: false })
  @ApiQuery({ name: 'maxCookingTime', type: Number, required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiOkResponse({ type: PaginatedResultDto<RecipeDto> })
  @ApiBadRequestResponse()
  async filterRecipes(
    @Query() filterDto: FilterRecipesDto,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.recipeService.filterRecipes(filterDto, paginationDto);
  }

  @ApiOperation({ summary: 'Get recipe by id' })
  @ApiOkResponse({ type: RecipeDto })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @UseInterceptors(EtagInterceptor)
  @Get(':id')
  @CacheKey('recipe_id_${{value:number}}')
  async getRecipeById(@Param('id') id: number) {
    return await this.recipeService.getById(id);
  }

  @Get('/suggestions/:text')
  @ApiOkResponse({ type: [String] })
  @ApiBadRequestResponse()
  @UseInterceptors(EtagInterceptor)
  @CacheKey('suggestions_${{value:text}}')
  async getSuggestions(@Param('text') text: string) {
    return await this.recipeService.getSuggestions(text);
  }

  @ApiOperation({ summary: 'Get all recipes' })
  @ApiOkResponse({ type: PaginatedResultDto<RecipeDto> })
  @ApiBadRequestResponse()
  @UseInterceptors(EtagInterceptor)
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @Get()
  async getAllRecipes(@Query() paginationDto: PaginationDto) {
    const page = paginationDto.page;
    const limit = paginationDto.limit;
    const cacheKey = `all_recipes_page_${page}_limit_${limit}`;

    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      console.log(`[Cache HIT] ${cacheKey}`);
      return cached;
    }

    console.log(`[Cache MISS] ${cacheKey}`);
    const result = await this.recipeService.getAll(paginationDto);

    await this.cacheManager.set(cacheKey, result, 50000);

    return result;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new recipe' })
  @ApiOkResponse({ type: RecipeDto })
  @ApiBadRequestResponse()
  @ApiUnauthorizedResponse()
  @ApiNotFoundResponse()
  @Post()
  async create(@Body() createRecipeDto: CreateRecipeDto) {
    const recipe = await this.recipeService.create(createRecipeDto);

    this.eventEmitter.emit('recipes', {
      type: 'RECIPE_CREATED',
      data: recipe,
    });
    return recipe;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete recipe by id' })
  @ApiOkResponse({ type: RecipeDto })
  @ApiBadRequestResponse()
  @ApiUnauthorizedResponse()
  @ApiNotFoundResponse()
  @Delete(':id')
  async deleteRecipe(@Param('id') id: number, @Req() request: Request) {
    const nickname = request.oidc.user?.nickname as string;
    await this.recipeService.delete(nickname, id);
  }
}
