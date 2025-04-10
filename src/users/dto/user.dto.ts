import { Field, ID, ObjectType, HideField } from '@nestjs/graphql';
import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
import {AutoMap} from "nestjsx-automapper";

@ObjectType('User') // GraphQL тип
export class UserDto {
    @Field(() => ID, {description: 'Unique identifier' }) // GraphQL поле (ID тип)
    @AutoMap()       // AutoMapper
    @ApiProperty({ example: 1, description: 'Unique identifier' }) // Swagger
    id: number;

    @Field(() => String, {description: 'Username' }) // GraphQL поле
    @AutoMap()
    @ApiProperty({ example: 'john_doe', description: 'Username' })
    username: string;

    @Field(() => String, {description: 'Email address' })
    @AutoMap()
    @ApiProperty({ example: 'john@example.com', description: 'Email address' })
    email: string;

    @HideField() // Скрыть в GraphQL схеме
    @AutoMap()
    @ApiHideProperty() // Скрыть в Swagger
    password: string;

    @Field(() => String, { nullable: true }) // Поле может быть null
    @AutoMap()
    @ApiProperty({
        example: 'https://example.com/avatar.jpg',
        description: 'User avatar URL',
        required: false
    })
    imageData?: string;
}