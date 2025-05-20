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

export class ReadRecipeDto {
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
  cookTime: number;

  @ApiProperty({ example: 4 })
  @AutoMap()
  @IsNumber()
  @IsNotEmpty()
  servings: number;

  @AutoMap()
  @ApiProperty({ isArray: true, type: () => String })
  @IsNotEmpty()
  recipeTags: string[];

  @ApiProperty({ example: '2023-01-01T00:00:00Z' })
  @AutoMap()
  @ApiProperty()
  @IsNotEmpty()
  createdAt: Date;

  @ApiProperty({ example: '2023-01-01T00:00:00Z' })
  @AutoMap()
  @ApiProperty()
  @Optional()
  updatedAt: Date | null;

  @AutoMap()
  @ApiProperty()
  @IsNotEmpty()
  createdByUser?: string;

  @ApiProperty({ required: false })
  @AutoMap()
  imageData: string;
}
