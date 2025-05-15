import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IngredientsService } from './ingredients.service';
import { IngredientsController } from './ingredients.controller';
import { Ingredient } from './entities/ingredient.entity';
import { Image } from '../shared/entities/image.entity';
import { Recipe } from '../recipes/entities/recipe.entity';
import { IngredientResolver } from './resolver/ingredient.resolver';
import { AutoMapper } from 'nestjsx-automapper';
import { MeasurementUnitService } from '../dictionaries/measurement/measurement-unit.service';
import { MeasurementUnit } from '../dictionaries/measurement/measurement-unit.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ingredient, Image, Recipe, MeasurementUnit]),
  ],
  controllers: [IngredientsController],
  providers: [
    IngredientsService,
    MeasurementUnitService,
    IngredientResolver,
    AutoMapper,
  ],
})
export class IngredientsModule {}
