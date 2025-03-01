import {AutoMap} from "nestjsx-automapper";
import {Column, Entity, JoinTable, ManyToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {Recipe} from "../../recipes/entities/recipe.entity";
import {JoinColumn} from "typeorm";
import {Picture} from "../../shared/entities/picture.entity";

@Entity('ingredient')
export class Ingredient {
    @AutoMap()
    @PrimaryGeneratedColumn()
    id: number;

    @AutoMap()
    @Column()
    name: string;

    @AutoMap()
    @Column()
    amount: number;

    @AutoMap()
    @OneToOne(() => Picture)
    @JoinColumn()
    pictureData: Picture;

    @ManyToMany(() => Recipe, recipe => recipe.ingredients)
    @JoinTable()
    recipes: Recipe[];
}