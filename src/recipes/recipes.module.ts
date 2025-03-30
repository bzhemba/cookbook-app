import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";
import { AutoMapper } from 'nestjsx-automapper';
import { RecipesService } from "./recipes.service";
import {Recipe} from "./entities/recipe.entity";
import {User} from "../users/entities/user.entity";
import {RecipesController} from "./recipes.controller";
import {Image} from "../shared/entities/image.entity";
import {RecipeTag} from "./entities/recipe-tag.entity";
import {Category} from "../category/entities/category.entity";
import {Ingredient} from "../ingredients/entities/ingredient.entity";
import {RecipeTagService} from "./recipe-tags.service";
import {RecipeTagController} from "./recipe-tags.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Recipe, User, Image, RecipeTag, Category, Ingredient])],
  controllers: [RecipesController, RecipeTagController],
  providers: [RecipesService, RecipeTagService, AutoMapper]
})

export class RecipesModule {}