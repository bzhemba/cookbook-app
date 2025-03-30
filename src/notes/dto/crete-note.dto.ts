import {ApiProperty} from "@nestjs/swagger";
import {AutoMap} from "nestjsx-automapper";

export class CreateNoteDto {
    @AutoMap()
    @ApiProperty()
    text: string;

    @AutoMap()
    @ApiProperty()
    createdByUser: string;
}