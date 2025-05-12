import {IsNumber, IsString} from "class-validator";
import {Field, ID, ObjectType} from "@nestjs/graphql";
import {ApiProperty} from "@nestjs/swagger";
import {AutoMap} from "nestjsx-automapper";

@ObjectType()
export class RecipeIngredientDto {
    @Field(() => String, { nullable: false })
    @AutoMap()
    @IsNumber()
    ingredient: string;

    @Field(() => Number, { nullable: false })
    @ApiProperty({ required: true, example: 1 })
    @AutoMap()
    @IsNumber()
    amount: number;

    @Field(() => String, { nullable: false })
    @ApiProperty({ required: true, example: 1 })
    @AutoMap()
    @IsString()
    unit: string;
}
