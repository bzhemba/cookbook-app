import { AutoMap } from 'nestjsx-automapper';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('category')
export class Category {
  @AutoMap()
  @PrimaryGeneratedColumn()
  id: number;

  @AutoMap()
  @Column()
  categoryTitle: string;
}
