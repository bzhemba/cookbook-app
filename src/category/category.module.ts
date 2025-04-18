import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { Category } from './entities/category.entity';
import { Recipe } from '../recipes/entities/recipe.entity';
import {CategoryResolver} from "./resolver/category.resolver";

@Module({
    imports: [TypeOrmModule.forFeature([Category, Recipe])],
    controllers: [CategoryController],
    providers: [CategoryService, CategoryResolver],
})
export class CategoryModule {}