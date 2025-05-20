import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';
import { AutoMap } from 'nestjsx-automapper';
import { Transform, Type } from 'class-transformer';

export class FilterRecipesDto {
  @IsOptional()
  @IsArray()
  @AutoMap()
  @ApiProperty({ isArray: true, type: () => String })
  @Transform(({ value }): string[] => {
    if (Array.isArray(value)) {
      return value.filter((item): item is string => typeof item === 'string');
    }
    if (typeof value === 'string') {
      return value.split(',').map((item) => item.trim());
    }
    return [];
  })
  @Type(() => String)
  categories?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @AutoMap()
  @ApiProperty({ isArray: true, type: String })
  @Transform(({ value }): string[] => {
    if (Array.isArray(value)) {
      return value.filter((item): item is string => typeof item === 'string');
    }
    if (typeof value === 'string') {
      return value.split(',').map((item) => item.trim());
    }
    return [];
  })
  @Type(() => String)
  tags?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @AutoMap()
  @ApiProperty({ isArray: true, type: () => String })
  @Transform(({ value }): string[] => {
    if (Array.isArray(value)) {
      return value.filter((item): item is string => typeof item === 'string');
    }
    if (typeof value === 'string') {
      return value.split(',').map((item) => item.trim());
    }
    return [];
  })
  @Type(() => String)
  ingredients?: string[];

  @IsOptional()
  @IsNumber()
  @AutoMap()
  @ApiProperty({ isArray: true, type: () => Number })
  @Type(() => Number)
  maxCookingTime?: number;
}
