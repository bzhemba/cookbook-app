import {PaginationLinksDto} from "./pagination-links.dto";
import {ApiProperty} from "@nestjs/swagger";
import {PaginationMetaDto} from "./pagination-meta.dto";
import {Field, Int, ObjectType} from "@nestjs/graphql";

@ObjectType({ description: 'Pagination result model' })
export class PaginatedResultDto<T> {
    @Field(() => Int, { description: 'Page number' })
    @ApiProperty({
        type: [Object],
        isArray: true,
    })
    data: T[];

    @Field(() => Int, { description: 'Page number' })
    @ApiProperty({ type: PaginationMetaDto })
    meta: PaginationMetaDto;

    @Field(() => Int, { description: 'Page number' })
    @ApiProperty({ type: PaginationLinksDto })
    links: PaginationLinksDto;
}