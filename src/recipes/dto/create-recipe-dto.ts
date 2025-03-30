import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsString, MaxLength} from "class-validator";
import {AutoMap} from "nestjsx-automapper";

export class CreateRecipeDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @MaxLength(50)
    name: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @MaxLength(100)
    description: string;

    @AutoMap()
    @ApiProperty({ isArray: true, type: () => Number })
    @IsNotEmpty()
    ingredientIds: number[];

    @AutoMap()
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @MaxLength(400)
    instructions: string;

    @AutoMap()
    @ApiProperty()
    @IsNotEmpty()
    prepTime: number;

    @AutoMap()
    @ApiProperty()
    @IsNotEmpty()
    cookTime: number;

    @AutoMap()
    @ApiProperty()
    @IsNotEmpty()
    servings: number;

    @ApiProperty({ isArray: true, type: () => Number })
    @IsNotEmpty()
    recipeTagIds: number[];

    @AutoMap()
    @ApiProperty()
    @IsNotEmpty()
    categoryId: number;

    @AutoMap()
    @ApiProperty()
    @IsNotEmpty()
    createdAt: Date;

    @AutoMap()
    @ApiProperty()
    @IsNotEmpty()
    createdByUser?: string;

    @ApiProperty()
    @IsNotEmpty()
    imageId: number;
}
