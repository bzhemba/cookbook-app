import {AutoMap} from "nestjsx-automapper";
import {ApiProperty} from "@nestjs/swagger";

export class UpdateNoteDto {
    @ApiProperty()
    id: number;

    @AutoMap()
    @ApiProperty()
    text: string;
}