import {Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany, JoinTable, ManyToOne, OneToOne} from "typeorm";
import {AutoMap} from "nestjsx-automapper";
import {User} from "../../users/entities/user.entity";
import {Ingredient} from "../../ingredients/entities/ingredient.entity";
import {Category} from "../../category/entities/category.entity";
import {JoinColumn} from "typeorm";
import {Image} from "../../shared/entities/image.entity";
import {RecipeTag} from "./recipe-tag.entity";

@Entity('recipe')
export class Recipe {
    @AutoMap()
    @PrimaryGeneratedColumn()
    id: number;

    @AutoMap()
    @ManyToOne(() => User, user => user.recipes,
        {onDelete: 'CASCADE'})
    createdByUser: User | null;

    @AutoMap()
    @Column()
    name: string;

    @AutoMap()
    @Column()
    description: string;

    @AutoMap()
    @ManyToMany(() => Ingredient, ingredient => ingredient.recipes)
    @JoinTable()
    ingredients: Ingredient[];

    @AutoMap()
    @Column()
    instructions: string;

    @AutoMap()
    @Column()
    prepTime: number;

    @AutoMap()
    @Column()
    cookTime: number;

    @AutoMap()
    @Column()
    servings: number;

    @ManyToMany(() => RecipeTag, tag => tag.recipes, { cascade: true })
    @JoinTable()
    recipeTags: RecipeTag[];

    @AutoMap()
    @ManyToOne(() => Category)
    @JoinColumn()
    category: Category

    @AutoMap()
    @Column()
    createdAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    updatedAt: Date | null;

    @AutoMap()
    @OneToOne(() => Image)
    @JoinColumn()
    imageData: Image;
}