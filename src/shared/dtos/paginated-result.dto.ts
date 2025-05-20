import { PaginationLinksDto } from './pagination-links.dto';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationMetaDto } from './pagination-meta.dto';

export class PaginatedResultDto<T> {
  @ApiProperty({
    type: [Object],
    isArray: true,
  })
  data: T[];

  @ApiProperty({ type: PaginationMetaDto })
  meta: PaginationMetaDto;

  @ApiProperty({ type: PaginationLinksDto })
  links: PaginationLinksDto;
}
