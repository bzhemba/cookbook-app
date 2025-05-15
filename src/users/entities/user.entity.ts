import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { AutoMap } from 'nestjsx-automapper';
import { Recipe } from '../../recipes/entities/recipe.entity';
import { Image } from '../../shared/entities/image.entity';

@Entity('user')
export class User {
  @AutoMap()
  @PrimaryGeneratedColumn()
  id: number;

  @AutoMap()
  @Column({ unique: true })
  username: string;

  @AutoMap()
  @Column({ unique: true })
  email: string;

  @AutoMap()
  @Column({ unique: true })
  password: string;

  @AutoMap()
  @OneToOne(() => Image)
  @JoinColumn()
  imageData?: Image;

  @AutoMap()
  @OneToMany(() => Recipe, (recipe) => recipe.createdByUser, { cascade: true })
  recipes: Recipe[];
}
