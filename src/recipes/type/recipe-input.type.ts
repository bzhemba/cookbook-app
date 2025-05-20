import { InputType, Field, Int } from '@nestjs/graphql';

@InputType({ description: 'Input for creating recipe' })
export class CreateRecipeInput {
  @Field({ description: 'Recipe title' })
  title: string;

  @Field({ description: 'Recipe description', nullable: true })
  description?: string;

  @Field({ description: 'Category ID' })
  categoryId: string;

  @Field(() => [String], { description: 'List of ingredients' })
  ingredients: string[];

  @Field(() => Int, { description: 'Cooking time in minutes' })
  cookingTime: number;
}
