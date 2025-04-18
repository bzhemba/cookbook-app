import { ApiProperty } from '@nestjs/swagger';
import {Field, Int, ObjectType} from "@nestjs/graphql";

@ObjectType({ description: 'Pagination meta model' })
export class PaginationMetaDto {
    @Field(() => Int, { description: 'Total pages number' })
    @ApiProperty({ description: 'Общее количество элементов', example: 100 })
    total: number;

    @Field(() => Int, { description: 'Page number' })
    @ApiProperty({ description: 'Текущая страница', example: 1 })
    page: number;

    @Field(() => Int, { description: 'Limit number' })
    @ApiProperty({ description: 'Количество элементов на странице', example: 10 })
    limit: number;

    @Field(() => Int, { description: 'Last page number' })
    @ApiProperty({ description: 'Последняя доступная страница', example: 10 })
    lastPage: number;
}