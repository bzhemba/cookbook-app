import {AutoMap} from "nestjsx-automapper";
import {ApiProperty} from "@nestjs/swagger";

export class UserDto {
    @AutoMap()
    @ApiProperty()
    id: number;

    @AutoMap()
    @ApiProperty()
    nickname: string;

    @AutoMap()
    @ApiProperty()
    email: string;

    @AutoMap()
    @ApiProperty()
    pictureData: string | null;
}