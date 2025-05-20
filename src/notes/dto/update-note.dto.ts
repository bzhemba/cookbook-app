import { AutoMap } from 'nestjsx-automapper';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateNoteDto {
  @ApiProperty({ example: 1 })
  @ApiProperty()
  id: number;

  @ApiProperty({ example: 'Updated test note' })
  @AutoMap()
  @ApiProperty()
  text: string;
}
