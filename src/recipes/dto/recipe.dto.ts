import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsArray, IsNumber, IsString } from 'class-validator';
import { RecipeTagDto } from './recipe-tag.dto';
import {AutoMap} from "nestjsx-automapper";
import {UserDto} from "../../users/dto/user.dto";
import {CategoryDto} from "../../category/dto/category.dto";
import {ImageDto} from "../../shared/dtos/image.dto";

export class RecipeDto {
    @ApiProperty({ example: 1 })
    @AutoMap()
    id: number;

    @ApiProperty({ example: 'Pasta Carbonara' })
    @AutoMap()
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ required: false })
    @AutoMap()
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ type: () => UserDto })
    @AutoMap()
    createdByUser: UserDto;

    @ApiProperty({ type: () => CategoryDto })
    @AutoMap()
    category: CategoryDto;

    @ApiProperty({ type: [String], example: ['Tomato', 'Pasta'] })
    @AutoMap()
    @IsArray()
    ingredients: string[];

    @ApiProperty({ required: false })
    @AutoMap()
    @IsOptional()
    @IsString()
    instructions?: string;

    @ApiProperty({ example: 30 })
    @AutoMap()
    @IsNumber()
    prepTime: number;

    @ApiProperty({ example: 15 })
    @AutoMap()
    @IsNumber()
    cookingTime: number;


    @ApiProperty({ example: 4 })
    @AutoMap()
    @IsNumber()
    servings: number;

    @ApiProperty({ type: () => RecipeTagDto, isArray: true })
    @AutoMap()
    @IsArray()
    recipeTags: RecipeTagDto[];

    @ApiProperty({ example: '2023-01-01T00:00:00Z' })
    @AutoMap()
    createdAt: Date;

    @ApiProperty({ required: false })
    @AutoMap()
    @IsOptional()
    updatedAt?: Date;

    @ApiProperty({ type: () => ImageDto, required: false })
    @AutoMap()
    @IsOptional()
    imageData?: ImageDto;
}