import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { AutoMapper } from 'nestjsx-automapper';
import { RecipesService } from './recipes.service';
import { Recipe } from './entities/recipe.entity';
import { User } from '../users/entities/user.entity';
import { RecipesController } from './recipes.controller';
import { Image } from '../shared/entities/image.entity';
import { RecipeTag } from './entities/recipe-tag.entity';
import { Category } from '../category/entities/category.entity';
import { Ingredient } from '../ingredients/entities/ingredient.entity';
import { RecipeTagService } from './recipe-tags.service';
import { RecipeTagController } from './recipe-tags.controller';
import { CacheModule } from '@nestjs/cache-manager';
import { MeasurementUnit } from '../dictionaries/measurement/measurement-unit.entity';
import { MeasurementUnitService } from '../dictionaries/measurement/measurement-unit.service';
import { RecipeIngredient } from '../ingredients/entities/recipe-ingredient.entity';

@Module({
  imports: [
    CacheModule.register({
      ttl: 60,
      max: 100,
    }),
    TypeOrmModule.forFeature([
      Recipe,
      User,
      Image,
      RecipeTag,
      Category,
      Ingredient,
      MeasurementUnit,
      RecipeIngredient,
    ]),
  ],
  controllers: [RecipesController, RecipeTagController],
  providers: [
    RecipesService,
    MeasurementUnitService,
    RecipeTagService,
    AutoMapper
  ],
})
export class RecipesModule {}
