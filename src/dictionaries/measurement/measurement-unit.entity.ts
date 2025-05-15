import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('measurement_unit')
export class MeasurementUnit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  symbol: string;
}
