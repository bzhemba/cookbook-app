import { ApiProperty } from '@nestjs/swagger';

export class PaginationMetaDto {
  @ApiProperty({ description: 'Общее количество элементов', example: 100 })
  total: number;

  @ApiProperty({ description: 'Текущая страница', example: 1 })
  page: number;

  @ApiProperty({ description: 'Количество элементов на странице', example: 10 })
  limit: number;

  @ApiProperty({ description: 'Последняя доступная страница', example: 10 })
  lastPage: number;
}
