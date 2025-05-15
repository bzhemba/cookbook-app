import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Recipe } from '../../recipes/entities/recipe.entity';
import { Ingredient } from './ingredient.entity';
import { MeasurementUnit } from '../../dictionaries/measurement/measurement-unit.entity';

@Entity('recipe_ingredient')
export class RecipeIngredient {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Recipe, (recipe) => recipe.ingredients)
  recipe: Recipe;

  @ManyToOne(() => Ingredient, { eager: true })
  ingredient: Ingredient;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @ManyToOne(() => MeasurementUnit, { eager: true })
  unit: MeasurementUnit;
}
