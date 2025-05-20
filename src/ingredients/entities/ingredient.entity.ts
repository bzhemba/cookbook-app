import { AutoMap } from 'nestjsx-automapper';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Recipe } from '../../recipes/entities/recipe.entity';

@Entity('ingredient')
export class Ingredient {
  @AutoMap()
  @PrimaryGeneratedColumn()
  id: number;

  @AutoMap()
  @Column()
  name: string;

  @ManyToMany(() => Recipe, (recipe) => recipe.ingredients)
  @JoinTable()
  recipes: Recipe[];
}
