import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Patch,
    Delete,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryDto } from './dto/category.dto';

@Controller('categories')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    @Post()
    async create(@Body() categoryDto: CategoryDto) {
        return this.categoryService.create(categoryDto);
    }

    @Get()
    async findAll() {
        return this.categoryService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: number) {
        return this.categoryService.findOne(id);
    }

    @Patch(':id')
    async update(@Param('id') id: number, @Body() categoryDto: CategoryDto) {
        return this.categoryService.update(id, categoryDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: number) {
        return this.categoryService.remove(id);
    }
}