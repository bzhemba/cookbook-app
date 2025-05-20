import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  UseFilters,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { IngredientsService } from './ingredients.service';
import { IngredientDto } from './dto/ingredient.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiQuery,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { HttpExceptionFilter } from '../shared/ExceptionFilter';
import { PaginatedResultDto } from '../shared/dtos/paginated-result.dto';
import { PaginationDto } from '../shared/dtos/pagination.dto';
import { TimingInterceptor } from '../interceptors/timing.interceptor';

@Controller('ingredients')
@UseFilters(new HttpExceptionFilter())
@UseInterceptors(TimingInterceptor)
export class IngredientsController {
  constructor(
    private readonly ingredientsService: IngredientsService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: IngredientDto })
  @ApiBadRequestResponse()
  @ApiUnauthorizedResponse()
  @ApiNotFoundResponse()
  async create(@Body() ingredientDto: CreateIngredientDto) {
    const ingredient = await this.ingredientsService.create(ingredientDto);
    this.eventEmitter.emit('ingredients', {
      type: 'INGREDIENT_CREATED',
      data: ingredient,
    });

    return ingredient;
  }

  @Get()
  @ApiOkResponse({ type: PaginatedResultDto<IngredientDto> })
  @ApiBadRequestResponse()
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getAll(@Query() paginationDto: PaginationDto) {
    return this.ingredientsService.getAll(paginationDto);
  }

  @Get(':id')
  @ApiOkResponse({ type: IngredientDto })
  @ApiBadRequestResponse()
  @ApiUnauthorizedResponse()
  @ApiNotFoundResponse()
  async findOne(@Param('id') id: number) {
    return this.ingredientsService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: IngredientDto })
  @ApiBadRequestResponse()
  @ApiUnauthorizedResponse()
  @ApiNotFoundResponse()
  async update(@Param('id') id: number, @Body() ingredientDto: IngredientDto) {
    return this.ingredientsService.update(id, ingredientDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiBadRequestResponse()
  @ApiUnauthorizedResponse()
  @ApiNotFoundResponse()
  async remove(@Param('id') id: number) {
    return this.ingredientsService.remove(id);
  }
}
