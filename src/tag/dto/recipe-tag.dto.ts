import {AutoMap} from "nestjsx-automapper";

export class RecipeTagDto {
    @AutoMap()
    id: number;

    @AutoMap()
    name: string;
}