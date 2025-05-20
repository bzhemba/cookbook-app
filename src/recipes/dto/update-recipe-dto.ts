import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AutoMap } from 'nestjsx-automapper';

import { RecipeTagDto } from './recipe-tag.dto';
import { IngredientDto } from '../../ingredients/dto/ingredient.dto';
import { ImageDto } from '../../shared/dtos/image.dto';
import { IsOptional } from 'class-validator';

export class UpdateRecipeDto {
  @ApiProperty({ example: 1 })
  @AutoMap()
  id: number;
  @ApiPropertyOptional()
  @AutoMap()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional()
  @AutoMap()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ type: [IngredientDto] })
  @AutoMap()
  @IsOptional()
  ingredients?: IngredientDto[];

  @ApiPropertyOptional()
  @AutoMap()
  @IsOptional()
  instructions?: string;

  @ApiPropertyOptional()
  @AutoMap()
  @IsOptional()
  prepTime?: number;

  @ApiPropertyOptional()
  @AutoMap()
  @IsOptional()
  cookTime?: number;

  @ApiPropertyOptional()
  @AutoMap()
  @IsOptional()
  servings?: number;

  @ApiPropertyOptional({ type: [RecipeTagDto] })
  @AutoMap()
  @IsOptional()
  tags?: RecipeTagDto[];

  @ApiPropertyOptional()
  @AutoMap()
  @IsOptional()
  categoryId?: number;

  @ApiProperty()
  @IsOptional()
  updatedAt?: Date;

  @ApiPropertyOptional()
  @AutoMap()
  @IsOptional()
  imageData?: ImageDto;
}
