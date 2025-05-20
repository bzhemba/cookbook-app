import { RecipeDto } from '../dto/recipe.dto';

export class PaginatedRecipes {
  data: RecipeDto[];

  total: number;

  page: number;

  limit: number;
}
