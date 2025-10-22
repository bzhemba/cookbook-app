import {IsNotEmpty} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";
import {AutoMap} from "nestjsx-automapper";

export class WriteCollectionDto {
    @ApiProperty({ example: 'Italian recipes' })
    @IsNotEmpty()
    name: string;

    @AutoMap()
    @ApiProperty()
    @IsNotEmpty()
    createdByUser?: string;
}