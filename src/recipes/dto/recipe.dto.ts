import {AutoMap} from "nestjsx-automapper";
import {ApiProperty} from "@nestjs/swagger";
import {UserDto} from "../../users/dto/user.dto";
import {CategoryDto} from "../../category/dto/category.dto";
import {IngredientDto} from "../../ingredients/dto/ingredient.dto";
import {ImageDto} from "../../shared/dtos/image.dto";
import {RecipeTagDto} from "./recipe-tag.dto";
import {Optional} from "@nestjs/common";

export class RecipeDto {
    @AutoMap()
    @ApiProperty()
    id: number;

    @AutoMap()
    @ApiProperty({type: () => UserDto})
    createdByUser: UserDto;

    @AutoMap()
    @ApiProperty()
    title: string;

    @AutoMap()
    @ApiProperty()
    description: string;

    @AutoMap()
    @ApiProperty({type: [IngredientDto]})
    ingredients: IngredientDto[];

    @AutoMap()
    @ApiProperty()
    instructions: string;

    @AutoMap()
    @ApiProperty()
    prepTime: number;

    @AutoMap()
    @ApiProperty()
    cookTime: number;

    @AutoMap()
    @ApiProperty()
    servings: number;

    @AutoMap()
    @ApiProperty({ type: [RecipeTagDto] })
    recipeTags: RecipeTagDto[];

    @AutoMap()
    @ApiProperty()
    category: CategoryDto

    @AutoMap()
    @ApiProperty()
    createdAt: Date;

    @AutoMap()
    @ApiProperty()
    @Optional()
    updatedAt?: Date;

    @AutoMap()
    @ApiProperty()
    imageData: ImageDto;
}