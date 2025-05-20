import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from 'nestjsx-automapper';

export class CreateUserDto {
  @AutoMap()
  @ApiProperty({
    example: 'john_doe',
    description: 'Username (3-20 characters)',
    minLength: 3,
    maxLength: 20,
  })
  username: string;

  @AutoMap()
  @ApiProperty({
    example: 'user@example.com',
    description: 'Valid email address',
    format: 'email',
  })
  email: string;

  @AutoMap()
  @ApiProperty({
    example: 'P@ssw0rd!',
    description: 'Password',
    minLength: 8,
  })
  password: string;
}
