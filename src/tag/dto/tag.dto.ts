import {AutoMap} from "nestjsx-automapper";

export class TagDto {
    @AutoMap()
    id: number;

    @AutoMap()
    name: string;
}