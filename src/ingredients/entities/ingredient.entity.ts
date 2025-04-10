import {AutoMap} from "nestjsx-automapper";
import {Column, Entity, JoinTable, ManyToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {Recipe} from "../../recipes/entities/recipe.entity";
import {JoinColumn} from "typeorm";
import {Image} from "../../shared/entities/image.entity";
import {Optional} from "@nestjs/common";

@Entity('ingredient')
export class Ingredient {
    @AutoMap()
    @PrimaryGeneratedColumn()
    id: number;

    @AutoMap()
    @Column()
    name: string;

    @ManyToMany(() => Recipe, recipe => recipe.ingredients)
    @JoinTable()
    recipes: Recipe[];
}