import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from 'nestjsx-automapper';

export class RecipeIngredientDto {
  @AutoMap()
  @IsNumber()
  ingredient: string;

  @ApiProperty({ required: true, example: 1 })
  @AutoMap()
  @IsNumber()
  amount: number;

  @ApiProperty({ required: true, example: 1 })
  @AutoMap()
  @IsString()
  unit: string;
}
