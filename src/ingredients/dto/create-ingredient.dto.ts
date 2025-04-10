import {AutoMap} from "nestjsx-automapper";
import {ApiProperty} from "@nestjs/swagger";
import {Optional} from "@nestjs/common";
import {IsNotEmpty, IsOptional} from "class-validator";
import {Field, ID, InputType} from "@nestjs/graphql";

@InputType({ description: 'Input for creating an ingredient' })
export class CreateIngredientDto {
    @Field(() => ID, { nullable: true })
    @ApiProperty({ required: false, example: 1 })
    @AutoMap()
    id: number;

    @Field()
    @ApiProperty({ example: 'Tomato' })
    @AutoMap()
    @IsNotEmpty()
    name: string;
}