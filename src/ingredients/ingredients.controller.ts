import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Patch,
    Delete,
    NotFoundException,
} from '@nestjs/common';
import { IngredientsService } from './ingredients.service';
import { IngredientDto } from './dto/ingredient.dto';

@Controller('ingredients')
export class IngredientsController {
    constructor(private readonly ingredientsService: IngredientsService) {}

    @Post()
    async create(@Body() ingredientDto: IngredientDto) {
        return this.ingredientsService.create(ingredientDto);
    }

    @Get()
    async findAll() {
        return this.ingredientsService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: number) {
        return this.ingredientsService.findOne(id);
    }

    @Patch(':id')
    async update(@Param('id') id: number, @Body() ingredientDto: IngredientDto) {
        return this.ingredientsService.update(id, ingredientDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: number) {
        return this.ingredientsService.remove(id);
    }
}