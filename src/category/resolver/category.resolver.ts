import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CategoryDto } from '../dto/category.dto';
import { CategoryService } from '../category.service';

@Resolver(() => CategoryDto)
export class CategoryResolver {
  constructor(private readonly categoryService: CategoryService) {}

  @Query(() => [CategoryDto], { description: 'Get all categories' })
  async getCategories(): Promise<CategoryDto[]> {
    return this.categoryService.findAll();
  }

  @Query(() => CategoryDto, { description: 'Get category by ID' })
  async getCategory(
    @Args('id', { type: () => Number }) id: number,
  ): Promise<CategoryDto> {
    return this.categoryService.findOne(id);
  }

  @Mutation(() => Boolean, { description: 'Delete category' })
  async deleteCategory(
    @Args('id', { type: () => Number }) id: number,
  ): Promise<boolean> {
    await this.categoryService.remove(id);
    return true;
  }
}
