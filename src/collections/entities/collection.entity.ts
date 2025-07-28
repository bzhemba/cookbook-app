import { AutoMap } from 'nestjsx-automapper';
import {
    Column,
    Entity, JoinColumn,
    JoinTable,
    ManyToMany, ManyToOne, OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Recipe } from '../../recipes/entities/recipe.entity';
import {User} from "../../users/entities/user.entity";
import {CollectionRecipe} from "./collection-recipe.entity";

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

    @OneToMany(() => CollectionRecipe, (collectionRecipe) => collectionRecipe.collection)
    recipesConnection: CollectionRecipe[];
}
