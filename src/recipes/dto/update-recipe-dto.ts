import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {AutoMap} from "nestjsx-automapper";

import { RecipeTagDto } from './recipe-tag.dto';
import {IngredientDto} from "../../ingredients/dto/ingredient.dto";
import {CategoryDto} from "../../category/dto/category.dto";
import {ImageDto} from "../../shared/dtos/image.dto";
import {Field, ID, InputType} from "@nestjs/graphql";
import {IsNumber, IsOptional, IsString} from "class-validator";

@InputType({ description: 'Input for updating a recipe' })
export class UpdateRecipeDto {
    @Field(() => ID, { description: 'Unique identifier' })
    @ApiProperty({ example: 1 })
    @AutoMap()
    id: number;

    @Field({ description: 'Recipe title' })
    @ApiPropertyOptional()
    @AutoMap()
    @IsOptional()
    title?: string;

    @Field({ description: 'Recipe description', nullable: true })
    @ApiPropertyOptional()
    @AutoMap()
    @IsOptional()
    description?: string;

    @ApiPropertyOptional({ type: [IngredientDto] })
    @AutoMap()
    @IsOptional()
    ingredients?: IngredientDto[];

    @ApiPropertyOptional()
    @AutoMap()
    @IsOptional()
    instructions?: string;

    @ApiPropertyOptional()
    @AutoMap()
    @IsOptional()
    prepTime?: number;

    @ApiPropertyOptional()
    @AutoMap()
    @IsOptional()
    cookTime?: number;

    @ApiPropertyOptional()
    @AutoMap()
    @IsOptional()
    servings?: number;

    @ApiPropertyOptional({ type: [RecipeTagDto] })
    @AutoMap()
    @IsOptional()
    tags?: RecipeTagDto[];

    @Field(() => ID, { description: 'Category ID' })
    @ApiPropertyOptional()
    @AutoMap()
    @IsOptional()
    categoryId?: number;

    @ApiProperty()
    @IsOptional()
    updatedAt?: Date;

    @ApiPropertyOptional()
    @AutoMap()
    @IsOptional()
    imageData?: ImageDto;
}