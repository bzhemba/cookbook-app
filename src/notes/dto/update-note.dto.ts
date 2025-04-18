import {AutoMap} from "nestjsx-automapper";
import {ApiProperty} from "@nestjs/swagger";
import {Field, ID, InputType} from "@nestjs/graphql";

@InputType({ description: 'Input for updating a note' })
export class UpdateNoteDto {
    @Field(() => ID, { description: 'Unique identifier' })
    @ApiProperty({ example: 1 })
    @ApiProperty()
    id: number;

    @Field({ description: 'Note text' })
    @ApiProperty({ example: 'Updated test note' })
    @AutoMap()
    @ApiProperty()
    text: string;
}