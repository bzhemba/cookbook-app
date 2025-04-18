import { Field, ID, ObjectType, HideField } from '@nestjs/graphql';
import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
import {AutoMap} from "nestjsx-automapper";

@ObjectType('User')
export class UserDto {
    @Field(() => ID, {description: 'Unique identifier' })
    @AutoMap()
    @ApiProperty({ example: 1, description: 'Unique identifier' })
    id: number;

    @Field(() => String, {description: 'Username' })
    @AutoMap()
    @ApiProperty({ example: 'john_doe', description: 'Username' })
    username: string;

    @Field(() => String, {description: 'Email address' })
    @AutoMap()
    @ApiProperty({ example: 'john@example.com', description: 'Email address' })
    email: string;

    @HideField()
    @AutoMap()
    @ApiHideProperty()
    password: string;

    @Field(() => String, { nullable: true })
    @AutoMap()
    @ApiProperty({
        example: 'https://example.com/avatar.jpg',
        description: 'User avatar URL',
        required: false
    })
    imageData?: string;
}