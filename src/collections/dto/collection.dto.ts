import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from 'nestjsx-automapper';
import { RecipeDto } from '../../recipes/dto/recipe.dto';
import { IsNotEmpty } from 'class-validator';
import {UserDto} from "../../users/dto/user.dto";

export class CollectionDto {
    @AutoMap()
    @ApiProperty()
    id: number;

    @ApiProperty({ example: 'Italian recipes' })
    @AutoMap()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ type: () => UserDto })
    @AutoMap()
    createdByUser: UserDto;

    @ApiProperty({ type: () => RecipeDto, isArray: true })
    @AutoMap()
    recipes: RecipeDto[];
}
