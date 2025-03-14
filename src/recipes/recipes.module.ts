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

@Module({
  imports: [TypeOrmModule.forFeature([Recipe, User, Image, RecipeTag, Category])],
  controllers: [RecipesController],
  providers: [RecipesService, AutoMapper]
})

export class RecipesModule {}