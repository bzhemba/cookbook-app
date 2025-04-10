import {ApiProperty} from "@nestjs/swagger";
import {AutoMap} from "nestjsx-automapper";
import {RecipeDto} from "../../recipes/dto/recipe.dto";
import {Field, ID, ObjectType} from "@nestjs/graphql";

@ObjectType('Category')
export class CategoryDto {
    @ApiProperty()
    @Field(() => ID, {description: 'Unique identifier' })
    id: number;

    @ApiProperty()
    @Field(() => String, {description: 'Category title' })
    categoryTitle: string;
}