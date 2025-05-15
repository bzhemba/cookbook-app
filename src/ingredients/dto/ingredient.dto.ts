import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from 'nestjsx-automapper';
import { RecipeDto } from '../../recipes/dto/recipe.dto';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@ObjectType({ description: 'Ingredient model' })
export class IngredientDto {
  @AutoMap()
  @ApiProperty()
  @Field(() => ID, { description: 'Unique identifier' })
  id: number;

  @Field({ description: 'Ingredient name' })
  @ApiProperty({ example: 'Tomato' })
  @AutoMap()
  @IsNotEmpty()
  name: string;

  @Field(() => [RecipeDto], {
    description: 'Recipes using this ingredient',
  })
  @ApiProperty({ type: () => RecipeDto, isArray: true })
  @AutoMap()
  recipes: RecipeDto[];
}
