import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from 'nestjsx-automapper';
import { UserDto } from '../../users/dto/user.dto';

export class NoteDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'New test note' })
  @AutoMap()
  @ApiProperty()
  text: string;

  @ApiProperty({ type: () => UserDto })
  @AutoMap()
  @ApiProperty({ type: () => UserDto })
  createdByUser: UserDto;
}
