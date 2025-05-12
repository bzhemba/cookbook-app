import {Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany, JoinTable, ManyToOne, OneToOne} from "typeorm";
import {AutoMap} from "nestjsx-automapper";
import {User} from "../../users/entities/user.entity";
import {Ingredient} from "../../ingredients/entities/ingredient.entity";
import {Category} from "../../category/entities/category.entity";
import {JoinColumn} from "typeorm";
import {Image} from "../../shared/entities/image.entity";
import {RecipeTag} from "./recipe-tag.entity";
import {RecipeIngredient} from "../../ingredients/entities/recipe-ingredient.entity";

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
    @OneToMany(() => RecipeIngredient, ri => ri.recipe)
    ingredients: RecipeIngredient[];

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

    @AutoMap()
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

    @AutoMap()
    @Column({ type: 'timestamp', nullable: true })
    updatedAt: Date | null;

    @AutoMap()
    @OneToOne(() => Image)
    @JoinColumn()
    imageData: Image;
}