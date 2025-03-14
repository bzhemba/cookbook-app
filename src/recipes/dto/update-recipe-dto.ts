import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {AutoMap} from "nestjsx-automapper";

import { RecipeTagDto } from './recipe-tag.dto';
import {IngredientDto} from "../../ingredients/dto/ingredient.dto";
import {CategoryDto} from "../../category/dto/category.dto";
import {ImageDto} from "../../shared/dtos/image.dto";

export class UpdateRecipeDto {
    @ApiPropertyOptional()
    @AutoMap()
    title?: string;

    @ApiPropertyOptional()
    @AutoMap()
    description?: string;

    @ApiPropertyOptional({ type: [IngredientDto] })
    @AutoMap()
    ingredients?: IngredientDto[];

    @ApiPropertyOptional()
    @AutoMap()
    instructions?: string;

    @ApiPropertyOptional()
    @AutoMap()
    prepTime?: number;

    @ApiPropertyOptional()
    @AutoMap()
    cookTime?: number;

    @ApiPropertyOptional()
    @AutoMap()
    servings?: number;

    @ApiPropertyOptional({ type: [RecipeTagDto] })
    @AutoMap()
    tags?: RecipeTagDto[];

    @ApiPropertyOptional()
    @AutoMap()
    category?: CategoryDto;

    @ApiProperty()
    updatedAt?: Date;

    @ApiPropertyOptional()
    @AutoMap()
    imageData?: ImageDto;
}