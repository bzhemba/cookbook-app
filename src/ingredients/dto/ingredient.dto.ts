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

  @ApiProperty({ type: () => RecipeDto, isArray: true })
  @AutoMap()
  recipes: RecipeDto[];
}
