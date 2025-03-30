import {AutoMap} from "nestjsx-automapper";
import {ApiProperty} from "@nestjs/swagger";
import {Optional} from "@nestjs/common";
import {IsNotEmpty} from "class-validator";

export class CreateIngredientDto {
    @AutoMap()
    @ApiProperty()
    id: number;

    @AutoMap()
    @ApiProperty()
    @IsNotEmpty()
    name: string;

    @AutoMap()
    @ApiProperty()
    @Optional()
    imageId: number;
}