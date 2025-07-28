import { AutoMap } from 'nestjsx-automapper';
import { ApiProperty } from '@nestjs/swagger';
import {IsNotEmpty, IsNumber} from 'class-validator';

export class CreateIngredientDto {
  @ApiProperty({ required: false, example: 1 })
  @AutoMap()
  id: number;

  @ApiProperty({ example: 'Tomato' })
  @AutoMap()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 0.9, description: 'Protein content per 100g', required: false })
  @AutoMap()
  @IsNumber()
  protein: number;

  @ApiProperty({ example: 0.2, description: 'Fat content per 100g', required: false })
  @AutoMap()
  @IsNumber()
  fat: number;

  @ApiProperty({ example: 3.9, description: 'Carbohydrates content per 100g', required: false })
  @AutoMap()
  @IsNumber()
  carbohydrates: number;

  @ApiProperty({ example: 18, description: 'Calories per 100g', required: false })
  @AutoMap()
  @IsNumber()
  calories: number;
}
