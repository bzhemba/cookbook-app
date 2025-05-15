import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AutoMapper } from 'nestjsx-automapper';
import { DictionaryController } from './dictionary.controller';
import { MeasurementUnitService } from './measurement/measurement-unit.service';
import { MeasurementUnit } from './measurement/measurement-unit.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MeasurementUnit])],
  controllers: [DictionaryController],
  providers: [MeasurementUnitService, AutoMapper],
})
export class DictionaryModule {}
