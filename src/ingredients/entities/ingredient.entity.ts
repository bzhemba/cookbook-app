import {AutoMap} from "nestjsx-automapper";
import {Column, Entity, JoinTable, ManyToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {Recipe} from "../../recipes/entities/recipe.entity";
import {JoinColumn} from "typeorm";
import {Image} from "../../shared/entities/image.entity";

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
    @OneToOne(() => Image)
    @JoinColumn()
    imageData: Image;

    @ManyToMany(() => Recipe, recipe => recipe.ingredients)
    @JoinTable()
    recipes: Recipe[];
}