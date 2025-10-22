import { AutoMap } from 'nestjsx-automapper';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { CollectionRecipe } from './collection-recipe.entity';

@Entity('collection')
export class Collection {
  @AutoMap()
  @PrimaryGeneratedColumn()
  id: number;

  @AutoMap()
  @Column()
  name: string;

  @AutoMap()
  @ManyToOne(() => User, (user) => user.collections, { onDelete: 'CASCADE' })
  createdByUser: User | null;

  @OneToMany(
    () => CollectionRecipe,
    (collectionRecipe) => collectionRecipe.collection,
    { cascade: true, onDelete: 'CASCADE' },
  )
  recipesConnection: CollectionRecipe[];
}
