import {AutoMap} from "nestjsx-automapper";
import {ApiProperty} from "@nestjs/swagger";

export class UserDto {
    @AutoMap()
    @ApiProperty()
    id: number;

    @AutoMap()
    @ApiProperty()
    username: string;

    @AutoMap()
    @ApiProperty()
    email: string;

    @AutoMap()
    @ApiProperty()
    password: string

    @AutoMap()
    @ApiProperty()
    imageData?: string;
}