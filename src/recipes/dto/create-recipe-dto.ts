import {Field, ID, InputType, Int} from "@nestjs/graphql";
import {ApiProperty} from "@nestjs/swagger";
import {IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength} from "class-validator";
import {AutoMap} from "nestjsx-automapper";

@InputType({ description: 'Input for creating a recipe' })
export class CreateRecipeDto {
    @Field({ description: 'Recipe title' })
    @ApiProperty({ example: 'Pasta Carbonara' })
    @AutoMap()
    @IsNotEmpty()
    @IsString()
    @MaxLength(50)
    name: string;

    @Field({ description: 'Recipe description', nullable: true })
    @ApiProperty({ required: false })
    @AutoMap()
    @IsString()
    @MaxLength(100)
    description: string;

    @Field(() => ID, { description: 'Category ID' })
    @ApiProperty({ example: 1 })
    @AutoMap()
    @ApiProperty()
    @IsNotEmpty()
    categoryId: number;

    @Field(() => [String], { description: 'List of ingredients' })
    @ApiProperty({ type: [String], example: ['Tomato', 'Pasta'] })
    @AutoMap()
    @ApiProperty({ isArray: true, type: () => Number })
    @IsNotEmpty()
    ingredientIds: number[];

    @Field({ description: 'Recipe instructions', nullable: true })
    @ApiProperty({ required: false })
    @AutoMap()
    @IsString()
    @MaxLength(400)
    instructions: string;

    @Field(() => Int, { description: 'Preparation time in minutes' })
    @ApiProperty({ example: 30 })
    @AutoMap()
    @IsNumber()
    @IsNotEmpty()
    prepTime: number;

    @Field(() => Int, { description: 'Cooking time in minutes' })
    @ApiProperty({ example: 15 })
    @AutoMap()
    @IsNumber()
    @IsNotEmpty()
    cookingTime: number;

    @Field(() => Int, { description: 'Servings amount' })
    @ApiProperty({ example: 4 })
    @AutoMap()
    @IsNumber()
    @IsNotEmpty()
    servings: number;

    @Field(() => [ID], { description: 'Tag IDs', nullable: true })
    @ApiProperty({ type: [Number], required: false })
    @AutoMap()
    @ApiProperty({ isArray: true, type: () => Number })
    @IsNotEmpty()
    recipeTagIds: number[];

    @Field(() => Date, { description: 'Creation date' })
    @ApiProperty({ example: '2023-01-01T00:00:00Z' })
    @AutoMap()
    @ApiProperty()
    @IsNotEmpty()
    createdAt: Date;

    @Field(() => String, { description: 'Recipe author' })
    @AutoMap()
    @ApiProperty()
    @IsNotEmpty()
    createdByUser?: string;

    @Field(() => ID, { description: 'Image ID', nullable: true })
    @ApiProperty({ required: false })
    @AutoMap()
    @IsNumber()
    imageId: number;
}