import {Field, Int, ObjectType} from "@nestjs/graphql";
import {RecipeDto} from "../dto/recipe.dto";

@ObjectType()
export class PaginatedRecipes {
    @Field(() => [RecipeDto])
    data: RecipeDto[];

    @Field(() => Int)
    total: number;

    @Field(() => Int)
    page: number;

    @Field(() => Int)
    limit: number;
}