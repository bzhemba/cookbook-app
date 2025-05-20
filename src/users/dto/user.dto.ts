import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
import { AutoMap } from 'nestjsx-automapper';

export class UserDto {
  @AutoMap()
  @ApiProperty({ example: 1, description: 'Unique identifier' })
  id: number;

  @AutoMap()
  @ApiProperty({ example: 'john_doe', description: 'Username' })
  username: string;

  @AutoMap()
  @ApiProperty({ example: 'john@example.com', description: 'Email address' })
  email: string;

  @AutoMap()
  @ApiHideProperty()
  password: string;

  @AutoMap()
  @ApiProperty({
    example: 'https://example.com/avatar.jpg',
    description: 'User avatar URL',
    required: false,
  })
  imageData?: string;
}
