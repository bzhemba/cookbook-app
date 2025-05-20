import { AutoMap } from 'nestjsx-automapper';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateIngredientDto {
  @ApiProperty({ required: false, example: 1 })
  @AutoMap()
  id: number;

  @ApiProperty({ example: 'Tomato' })
  @AutoMap()
  @IsNotEmpty()
  name: string;
}
