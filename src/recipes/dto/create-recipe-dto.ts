import {ApiProperty} from "@nestjs/swagger";
import {IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength} from "class-validator";
import {AutoMap} from "nestjsx-automapper";
import {CreateRecipeIngredientDto} from "../../ingredients/dto/create-recipe-ingredient";

export class CreateRecipeDto {
    @ApiProperty({ example: 'Pasta Carbonara' })
    @AutoMap()
    @IsNotEmpty()
    @IsString()
    @MaxLength(50)
    name: string;

    @ApiProperty({ required: false })
    @AutoMap()
    @IsString()
    @MaxLength(100)
    description: string;

    @ApiProperty({ example: 1 })
    @AutoMap()
    @ApiProperty()
    @IsNotEmpty()
    categoryId: number;

    @ApiProperty({ description: 'List of ingredients' })
    @IsArray()
    @ApiProperty({ isArray: true, type: () => CreateRecipeIngredientDto })
    @AutoMap()
    ingredients: CreateRecipeIngredientDto[];

    @ApiProperty({ required: false })
    @AutoMap()
    @IsString()
    @MaxLength(400)
    instructions: string;

    @ApiProperty({ example: 30 })
    @AutoMap()
    @IsNumber()
    @IsNotEmpty()
    prepTime: number;

    @ApiProperty({ example: 15 })
    @AutoMap()
    @IsNumber()
    @IsNotEmpty()
    cookingTime: number;

    @ApiProperty({ example: 4 })
    @AutoMap()
    @IsNumber()
    @IsNotEmpty()
    servings: number;

    @ApiProperty({ type: [Number], required: false })
    @AutoMap()
    @ApiProperty({ isArray: true, type: () => Number })
    @IsNotEmpty()
    recipeTagIds: number[];

    @ApiProperty({ example: '2023-01-01T00:00:00Z' })
    @AutoMap()
    @ApiProperty()
    @IsNotEmpty()
    createdAt: Date;

    @AutoMap()
    @ApiProperty()
    @IsNotEmpty()
    createdByUser?: string;

    @ApiProperty({ required: false })
    @AutoMap()
    @IsNumber()
    imageId: number;
}