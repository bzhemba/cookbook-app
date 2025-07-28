import {Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Collection} from "./collection.entity";
import {Recipe} from "../../recipes/entities/recipe.entity";

@Entity()
export class CollectionRecipe {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Collection, collection => collection.recipesConnection)
    @JoinColumn({ name: 'collectionId' })
    collection: Collection;

    @Column()
    collectionId: number;

    @ManyToOne(() => Recipe)
    @JoinColumn({ name: 'recipeId' })
    recipe: Recipe;

    @Column()
    recipeId: number;
}