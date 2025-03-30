import {ApiProperty} from "@nestjs/swagger";
import {AutoMap} from "nestjsx-automapper";
import {RecipeDto} from "../../recipes/dto/recipe.dto";

export class CategoryDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    categoryTitle: string;
}