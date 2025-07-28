import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
import { AutoMap } from 'nestjsx-automapper';
import {ManyToMany} from "typeorm";
import {Recipe} from "../../recipes/entities/recipe.entity";
import {RecipeDto} from "../../recipes/dto/recipe.dto";
import {CollectionDto} from "../../collections/dto/collection.dto";

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

  @ApiProperty({ type: () => RecipeDto, isArray: true })
  @AutoMap()
  createdRecipes: RecipeDto[];

  @ApiProperty({ type: () => RecipeDto, isArray: true })
  @AutoMap()
  savedCollections: CollectionDto[];

  @AutoMap()
  @ApiProperty({
    example: 'https://example.com/avatar.jpg',
    description: 'User avatar URL',
    required: false,
  })
  imageData?: string;

}
