import {ApiProperty} from "@nestjs/swagger";
import {AutoMap} from "nestjsx-automapper";
import {RecipeDto} from "../../recipes/dto/recipe.dto";
import {PictureDto} from "../../shared/dtos/picture.dto";

export class IngredientDto {
    @AutoMap()
    @ApiProperty()
    id: number;

    @AutoMap()
    @ApiProperty()
    name: string;

    @AutoMap()
    @ApiProperty()
    amount: number;

    @AutoMap()
    @ApiProperty()
    pictureData: PictureDto;

    @AutoMap()
    @ApiProperty({ isArray: true, type: () => RecipeDto })
    recipes: RecipeDto[];
}