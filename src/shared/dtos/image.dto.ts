import { ApiProperty } from '@nestjs/swagger';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { AutoMap } from 'nestjsx-automapper';

@ObjectType({ description: 'Image model' })
export class ImageDto {
  @ApiProperty()
  @Field(() => ID, { description: 'Unique identifier' })
  @AutoMap()
  id: number;

  @ApiProperty()
  @Field(() => String, { description: 'Image url' })
  @AutoMap()
  imageData: string;
}
