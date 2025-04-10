import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import {AutoMap} from "nestjsx-automapper";

@InputType()
export class CreateUserDto {
    @Field(() => String) // GraphQL поле
    @AutoMap()
    @ApiProperty({
        example: 'john_doe',
        description: 'Username (3-20 characters)',
        minLength: 3,
        maxLength: 20
    })
    username: string;

    @Field(() => String)
    @AutoMap()
    @ApiProperty({
        example: 'user@example.com',
        description: 'Valid email address',
        format: 'email'
    })
    email: string;

    @Field(() => String)
    @AutoMap()
    @ApiProperty({
        example: 'P@ssw0rd!',
        description: 'Password (min 8 characters)',
        minLength: 8
    })
    password: string;
}