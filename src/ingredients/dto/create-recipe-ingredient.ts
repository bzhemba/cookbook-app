import { IsNumber, IsString } from 'class-validator';
import { Field, ID, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from 'nestjsx-automapper';

@InputType({ description: 'Input for creating an ingredient' })
export class CreateRecipeIngredientDto {
  @Field(() => ID, { nullable: false })
  @AutoMap()
  @IsNumber()
  ingredientId: number;

  @Field(() => Number, { nullable: false })
  @ApiProperty({ required: true, example: 1 })
  @AutoMap()
  @IsNumber()
  amount: number;

  @Field(() => Number, { nullable: false })
  @ApiProperty({ required: true, example: 1 })
  @AutoMap()
  @IsString()
  unitId: number;
}
