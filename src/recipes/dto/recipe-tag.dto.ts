import {ApiProperty} from "@nestjs/swagger";
import {AutoMap} from "nestjsx-automapper";
import {Field, ID, ObjectType} from "@nestjs/graphql";

@ObjectType({ description: 'Recipe tag model' })
export class RecipeTagDto {
    @AutoMap()
    @ApiProperty()
    @Field(() => ID, { description: 'Unique identifier' })
    id: number;

    @AutoMap()
    @ApiProperty()
    @Field(() => ID, { description: 'Tag title' })
    name: string;
}