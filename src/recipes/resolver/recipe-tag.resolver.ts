import { Query, Resolver } from '@nestjs/graphql';
import {RecipeTagDto} from "../dto/recipe-tag.dto";
import {RecipeTagService} from "../recipe-tags.service";


@Resolver(() => RecipeTagDto)
export class RecipeTagResolver {
    constructor(private readonly recipeTagService: RecipeTagService) {}

    @Query(() => [RecipeTagDto], {
        description: 'Get all recipe tags',
        nullable: 'items' // Makes each item in array nullable if needed
    })
    async recipeTags(): Promise<RecipeTagDto[]> {
        return this.recipeTagService.getAll();
    }
}