import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany, JoinTable } from "typeorm";
import { AutoMap } from "nestjsx-automapper";
import {Recipe} from "../../recipes/entities/recipe.entity";

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
    @OneToMany(() => Recipe, recipe => recipe.createdByUser,
        { cascade: true })
    recipes: Recipe[];
}