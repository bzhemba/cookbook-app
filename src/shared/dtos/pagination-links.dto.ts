import { ApiPropertyOptional } from '@nestjs/swagger';

export class PaginationLinksDto {
  @ApiPropertyOptional({
    example: '/resources?page=1&limit=10',
  })
  first?: string;

  @ApiPropertyOptional({
    example: '/resources?page=1&limit=10',
  })
  previous?: string;

  @ApiPropertyOptional({
    example: '/resources?page=2&limit=10',
  })
  next?: string;

  @ApiPropertyOptional({
    example: '/resources?page=10&limit=10',
  })
  last?: string;
}
