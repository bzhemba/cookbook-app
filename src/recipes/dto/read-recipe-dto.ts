import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
} from 'class-validator';
import { AutoMap } from 'nestjsx-automapper';
import { RecipeIngredientDto } from '../../ingredients/dto/recipe-ingredient.dto';
import { Optional } from '@nestjs/common';

@ObjectType()
export class ReadRecipeDto {
  @Field({ description: 'Recipe title' })
  @ApiProperty({ example: 'Pasta Carbonara' })
  @AutoMap()
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  name: string;

  @Field({ description: 'Recipe description', nullable: true })
  @ApiProperty({ required: false })
  @AutoMap()
  @IsString()
  @MaxLength(100)
  description: string;

  @Field(() => String, { description: 'Category title' })
  @ApiProperty({ example: 'hot meal' })
  @AutoMap()
  @ApiProperty()
  @IsNotEmpty()
  category: string;

  @ApiProperty({ description: 'List of ingredients' })
  @IsArray()
  @ApiProperty({ isArray: true, type: () => RecipeIngredientDto })
  @AutoMap()
  ingredients: RecipeIngredientDto[];

  @Field({ description: 'Recipe instructions', nullable: true })
  @ApiProperty({ required: false })
  @AutoMap()
  @IsString()
  @MaxLength(400)
  instructions: string;

  @Field(() => Int, { description: 'Preparation time in minutes' })
  @ApiProperty({ example: 30 })
  @AutoMap()
  @IsNumber()
  @IsNotEmpty()
  prepTime: number;

  @Field(() => Int, { description: 'Cooking time in minutes' })
  @ApiProperty({ example: 15 })
  @AutoMap()
  @IsNumber()
  @IsNotEmpty()
  cookTime: number;

  @Field(() => Int, { description: 'Servings amount' })
  @ApiProperty({ example: 4 })
  @AutoMap()
  @IsNumber()
  @IsNotEmpty()
  servings: number;

  @Field(() => [String], { description: 'Tags', nullable: true })
  @AutoMap()
  @ApiProperty({ isArray: true, type: () => String })
  @IsNotEmpty()
  recipeTags: string[];

  @Field(() => Date, { description: 'Creation date' })
  @ApiProperty({ example: '2023-01-01T00:00:00Z' })
  @AutoMap()
  @ApiProperty()
  @IsNotEmpty()
  createdAt: Date;

  @Field(() => Date, { description: 'Update date' })
  @ApiProperty({ example: '2023-01-01T00:00:00Z' })
  @AutoMap()
  @ApiProperty()
  @Optional()
  updatedAt: Date | null;

  @Field(() => String, { description: 'Recipe author' })
  @AutoMap()
  @ApiProperty()
  @IsNotEmpty()
  createdByUser?: string;

  @Field(() => String, { description: 'Image key', nullable: true })
  @ApiProperty({ required: false })
  @AutoMap()
  imageData: string;
}
