import {Column, Entity, ManyToMany, PrimaryGeneratedColumn} from "typeorm";
import {AutoMap} from "nestjsx-automapper";
import {Recipe} from "./recipe.entity";

@Entity()
export class RecipeTag {
    @AutoMap()
    @PrimaryGeneratedColumn()
    id: number;

    @AutoMap()
    @Column()
    name: string;

    @AutoMap()
    @ManyToMany(() => Recipe, recipe => recipe.recipeTags)
    recipes: Recipe[];
}