import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from 'nestjsx-automapper';
import { UserDto } from '../../users/dto/user.dto';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Note model' })
export class NoteDto {
  @Field(() => ID, { description: 'Unique identifier' })
  @ApiProperty({ example: 1 })
  id: number;

  @Field({ description: 'Note text' })
  @ApiProperty({ example: 'New test note' })
  @AutoMap()
  @ApiProperty()
  text: string;

  @Field(() => UserDto, { description: 'Note author' })
  @ApiProperty({ type: () => UserDto })
  @AutoMap()
  @ApiProperty({ type: () => UserDto })
  createdByUser: UserDto;
}
