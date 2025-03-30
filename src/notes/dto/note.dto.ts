import {ApiProperty} from "@nestjs/swagger";
import {AutoMap} from "nestjsx-automapper";
import {UserDto} from "../../users/dto/user.dto";

export class NoteDto {
    @ApiProperty()
    id: number;

    @AutoMap()
    @ApiProperty()
    text: string;

    @AutoMap()
    @ApiProperty({type: () => UserDto})
    createdByUser: UserDto;
}