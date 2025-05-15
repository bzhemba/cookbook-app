import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { Controller, Get } from '@nestjs/common';
import { RecipeTagService } from './recipe-tags.service';
import { RecipeTagDto } from './dto/recipe-tag.dto';

@Controller('recipe-tags')
export class RecipeTagController {
  constructor(private readonly recipeTagService: RecipeTagService) {}

  @ApiOperation({ summary: 'Get all recipe tags' })
  @ApiOkResponse({ type: RecipeTagDto, isArray: true })
  @Get()
  async getAllRecipes() {
    return await this.recipeTagService.getAll();
  }
}
