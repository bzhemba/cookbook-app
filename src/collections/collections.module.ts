import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {CollectionsController} from "./collections.controller";
import {CollectionsService} from "./collections.service";
import { Recipe } from '../recipes/entities/recipe.entity';
import {Collection} from "./entities/collection.entity";
import {CollectionRecipe} from "./entities/collection-recipe.entity";
import {User} from "../users/entities/user.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([Collection, CollectionRecipe, User, Recipe]),
    ],
    controllers: [CollectionsController],
    providers: [CollectionsService],
})
export class CollectionsModule {}
