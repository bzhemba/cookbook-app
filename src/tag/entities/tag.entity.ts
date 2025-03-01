import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany} from 'typeorm';
import {AutoMap} from "nestjsx-automapper";
import {User} from "../../users/entities/user.entity";
import {Recipe} from "../../recipes/entities/recipe.entity";

@Entity()
export class Tag {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @AutoMap()
    @ManyToMany(() => Recipe, recipe => recipe.tags,
        {onDelete: 'CASCADE'})
    recipes: Recipe;
}