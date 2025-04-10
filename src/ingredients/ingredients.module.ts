import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IngredientsService } from './ingredients.service';
import { IngredientsController } from './ingredients.controller';
import { Ingredient } from './entities/ingredient.entity';
import { Image } from '../shared/entities/image.entity';
import { Recipe } from '../recipes/entities/recipe.entity';
import {IngredientResolver} from "./resolver/ingredient.resolver";
import {AutoMapper} from "nestjsx-automapper";

@Module({
    imports: [TypeOrmModule.forFeature([Ingredient, Image, Recipe])],
    controllers: [IngredientsController],
    providers: [IngredientsService, IngredientResolver, AutoMapper],
})
export class IngredientsModule {}