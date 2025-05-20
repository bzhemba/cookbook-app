import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from 'nestjsx-automapper';

export class ImageDto {
  @ApiProperty()
  @AutoMap()
  id: number;

  @ApiProperty()
  @AutoMap()
  imageData: string;
}
