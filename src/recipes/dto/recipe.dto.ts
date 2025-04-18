import {ObjectType, Field, ID, Int} from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsArray, IsNumber, IsString } from 'class-validator';
import { RecipeTagDto } from './recipe-tag.dto';
import {AutoMap} from "nestjsx-automapper";
import {UserDto} from "../../users/dto/user.dto";
import {CategoryDto} from "../../category/dto/category.dto";
import {ImageDto} from "../../shared/dtos/image.dto";

@ObjectType({ description: 'Recipe model' })
export class RecipeDto {
    @Field(() => ID, { description: 'Unique identifier' })
    @ApiProperty({ example: 1 })
    @AutoMap()
    id: number;

    @Field({ description: 'Recipe title' })
    @ApiProperty({ example: 'Pasta Carbonara' })
    @AutoMap()
    @IsNotEmpty()
    @IsString()
    name: string;

    @Field({ description: 'Recipe description', nullable: true })
    @ApiProperty({ required: false })
    @AutoMap()
    @IsOptional()
    @IsString()
    description?: string;

    @Field(() => UserDto, { description: 'Recipe author' })
    @ApiProperty({ type: () => UserDto })
    @AutoMap()
    createdByUser: UserDto;

    @Field(() => CategoryDto, { description: 'Recipe category' })
    @ApiProperty({ type: () => CategoryDto })
    @AutoMap()
    category: CategoryDto;

    @Field(() => [String], { description: 'List of ingredients' })
    @ApiProperty({ type: [String], example: ['Tomato', 'Pasta'] })
    @AutoMap()
    @IsArray()
    ingredients: string[];

    @Field({ description: 'Recipe instructions', nullable: true })
    @ApiProperty({ required: false })
    @AutoMap()
    @IsOptional()
    @IsString()
    instructions?: string;

    @Field(() => Int, { description: 'Preparation time in minutes' })
    @ApiProperty({ example: 30 })
    @AutoMap()
    @IsNumber()
    prepTime: number;

    @Field(() => Int, { description: 'Cooking time in minutes' })
    @ApiProperty({ example: 15 })
    @AutoMap()
    @IsNumber()
    cookingTime: number;

    @Field(() => Int, { description: 'Servings amount' })
    @ApiProperty({ example: 4 })
    @AutoMap()
    @IsNumber()
    servings: number;

    @Field(() => [RecipeTagDto], { description: 'List of tags' })
    @ApiProperty({ type: () => RecipeTagDto, isArray: true })
    @AutoMap()
    @IsArray()
    recipeTags: RecipeTagDto[];

    @Field(() => Date, { description: 'Creation date' })
    @ApiProperty({ example: '2023-01-01T00:00:00Z' })
    @AutoMap()
    createdAt: Date;

    @Field(() => Date, { description: 'Date of updating', nullable: true })
    @ApiProperty({ required: false })
    @AutoMap()
    @IsOptional()
    updatedAt?: Date;

    @Field(() => ImageDto, { description: 'Recipe image', nullable: true })
    @ApiProperty({ type: () => ImageDto, required: false })
    @AutoMap()
    @IsOptional()
    imageData?: ImageDto;
}