import { AutoMap } from 'nestjsx-automapper';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';
import { ImageDto } from '../../shared/dtos/image.dto';
export class UpdateUserDto {
  @MaxLength(50)
  username?: string;

  @AutoMap()
  @ApiPropertyOptional()
  @IsNotEmpty()
  @MaxLength(320)
  email?: string;

  @AutoMap()
  @ApiProperty()
  password?: string;

  @AutoMap()
  @ApiPropertyOptional()
  imageData?: ImageDto;
}
