import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Patch,
    Delete,
    NotFoundException, UseGuards,
} from '@nestjs/common';
import { IngredientsService } from './ingredients.service';
import { IngredientDto } from './dto/ingredient.dto';
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {ApiBearerAuth} from "@nestjs/swagger";
import {CreateIngredientDto} from "./dto/create-ingredient.dto";
import {EventEmitter2} from "@nestjs/event-emitter";

@Controller('ingredients')
@UseGuards(JwtAuthGuard)
export class IngredientsController {
    constructor(private readonly ingredientsService: IngredientsService, private eventEmitter: EventEmitter2) {}

    @Post()
    @ApiBearerAuth()
    async create(@Body() ingredientDto: CreateIngredientDto) {
        const ingredient = await this.ingredientsService.create(ingredientDto);
        this.eventEmitter.emit('ingredients', {
            type: 'INGREDIENT_CREATED',
            data: ingredient
        });

        return ingredient;
    }

    @Get()
    @ApiBearerAuth()
    async findAll() {
        return this.ingredientsService.findAll();
    }

    @Get(':id')
    @ApiBearerAuth()
    async findOne(@Param('id') id: number) {
        return this.ingredientsService.findOne(id);
    }

    @Patch(':id')
    @ApiBearerAuth()
    async update(@Param('id') id: number, @Body() ingredientDto: IngredientDto) {
        return this.ingredientsService.update(id, ingredientDto);
    }

    @Delete(':id')
    @ApiBearerAuth()
    async remove(@Param('id') id: number) {
        return this.ingredientsService.remove(id);
    }
}