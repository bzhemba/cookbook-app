import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AutoMap } from 'nestjsx-automapper';

import { IsOptional } from 'class-validator';

export class UpdateRecipeDto {
  @ApiProperty({ example: 1 })
  @AutoMap()
  id: number;

  @ApiPropertyOptional()
  @AutoMap()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional()
  @AutoMap()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional()
  @AutoMap()
  @IsOptional()
  instructions?: string;
}
