import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from 'nestjsx-automapper';

export class CreateNoteDto {
  @ApiProperty({ example: 'New test note' })
  @AutoMap()
  @ApiProperty()
  text: string;

  @ApiProperty()
  @AutoMap()
  @ApiProperty()
  createdByUser: string;
}
