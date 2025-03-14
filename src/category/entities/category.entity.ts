import {AutoMap} from "nestjsx-automapper";
import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Recipe} from "../../recipes/entities/recipe.entity";

@Entity('category')
export class Category {
    @AutoMap()
    @PrimaryGeneratedColumn()
    id: number;

    @AutoMap()
    @Column()
    categoryTitle: string;

    @AutoMap()
    @OneToMany(() => Recipe, recipe => recipe.category,
        { cascade: true })
    recipes: Recipe[];
}