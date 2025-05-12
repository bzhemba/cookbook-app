import {Type} from "class-transformer";
import {IsInt, Min} from "class-validator";
import {Field, InputType, Int} from "@nestjs/graphql";

@InputType({ description: 'Pagination model' })
export class PaginationDto {
    @Field(() => Int, { description: 'Page number' })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page: number = 1;

    @Field(() => Int, { description: 'Limit number' })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit: number = 1;
}