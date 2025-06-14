import { Controller, Get, UseFilters, UseInterceptors } from '@nestjs/common';

import { ApiBadRequestResponse, ApiOkResponse } from '@nestjs/swagger';
import { HttpExceptionFilter } from '../shared/ExceptionFilter';
import { MeasurementUnit } from './measurement/measurement-unit.entity';
import { MeasurementUnitService } from './measurement/measurement-unit.service';

@Controller('dictionary')
@UseFilters(new HttpExceptionFilter())
export class DictionaryController {
  constructor(
    private readonly measurementUnitService: MeasurementUnitService,
  ) {}

  @Get('measurements')
  @ApiOkResponse({ type: MeasurementUnit })
  @ApiBadRequestResponse()
  async getAll() {
    return this.measurementUnitService.getAll();
  }
}
