import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from 'nestjsx-automapper';
import { RecipeDto } from '../../recipes/dto/recipe.dto';
import { IsNotEmpty } from 'class-validator';

export class IngredientDto {
  @AutoMap()
  @ApiProperty()
  id: number;

  @ApiProperty({ example: 'Tomato' })
  @AutoMap()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 0.9, description: 'Protein content per 100g', required: false })
  @AutoMap()
  protein: number;

  @ApiProperty({ example: 0.2, description: 'Fat content per 100g', required: false })
  @AutoMap()
  fat: number;

  @ApiProperty({ example: 3.9, description: 'Carbohydrates content per 100g', required: false })
  @AutoMap()
  carbohydrates: number;

  @ApiProperty({ example: 18, description: 'Calories per 100g', required: false })
  @AutoMap()
  calories: number;

  @ApiProperty({ type: () => RecipeDto, isArray: true })
  @AutoMap()
  recipes: RecipeDto[];
}
