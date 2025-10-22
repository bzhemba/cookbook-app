import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from 'nestjsx-automapper';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class DeleteRecipeDto {
  @ApiProperty({ example: 1 })
  @AutoMap()
  id: number;

  @ApiProperty({ example: 'Admin' })
  @AutoMap()
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  username: string;
}
