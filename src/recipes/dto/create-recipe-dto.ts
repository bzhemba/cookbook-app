import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsString, MaxLength} from "class-validator";
import {AutoMap} from "nestjsx-automapper";
import {IngredientDto} from "../../ingredients/dto/ingredient.dto";
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
    @ApiProperty({type: [IngredientDto]})
    @IsNotEmpty()
    ingredients: IngredientDto[];

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

    @ApiProperty()
    @IsNotEmpty()
    imageId: number;
}
