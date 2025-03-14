import {ApiProperty} from "@nestjs/swagger";
import {AutoMap} from "nestjsx-automapper";

export class RecipeTagDto {
    @AutoMap()
    @ApiProperty()
    id: number;

    @AutoMap()
    @ApiProperty()
    name: string;
}