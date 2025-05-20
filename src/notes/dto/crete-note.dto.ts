import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from 'nestjsx-automapper';
import { Field, InputType } from '@nestjs/graphql';

@InputType({ description: 'Input for creating a note' })
export class CreateNoteDto {
  @Field({ description: 'Note text' })
  @ApiProperty({ example: 'New test note' })
  @AutoMap()
  @ApiProperty()
  text: string;

  @Field(() => String, { description: 'Note author' })
  @ApiProperty()
  @AutoMap()
  @ApiProperty()
  createdByUser: string;
}
