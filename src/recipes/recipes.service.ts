import {ForbiddenException, Injectable, NotFoundException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Like, Repository} from "typeorm";
import {Recipe} from "./entities/recipe.entity";
import {User} from "../users/entities/user.entity";
import {CreateRecipeDto} from "./dto/create-recipe-dto";
import {Image} from "../shared/entities/image.entity";
import {RecipeTag} from "./entities/recipe-tag.entity";
import {Ingredient} from "../ingredients/entities/ingredient.entity";
import {Category} from "../category/entities/category.entity";
import {UpdateRecipeDto} from "./dto/update-recipe-dto";
import {PaginationDto} from "../shared/dtos/pagination.dto";
import {PaginatedResultDto} from "../shared/dtos/paginated-result.dto";

@Injectable()
export class RecipesService {
    constructor(
        @InjectRepository(Recipe)
        private readonly recipeRepository: Repository<Recipe>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Image)
        private readonly imageRepository: Repository<Image>,
        @InjectRepository(RecipeTag)
        private readonly recipeTagRepository: Repository<RecipeTag>,
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
        @InjectRepository(Ingredient)
        private readonly ingredientRepository: Repository<Ingredient>,
    ) {}

    async getByText(text: string) {
        const recipes = await this.recipeRepository.find({
            where: {
                name: Like(`%${text}%`),
            },
            relations: {
                createdByUser: true,
                recipeTags: true,
                ingredients: true,
                category: true,
                imageData: true
            },
        });

        if (recipes.length === 0) {
            throw new NotFoundException(`Рецепты по запросу "${text}" не найдены`);
        }

        return recipes;
    }

    async getSuggestions(text: string) {
        const recipes = await this.recipeRepository.find({
            where: {
                name: Like(`%${text}%`),
            },
            select: ['name'],
            take: 5,
        });
        return recipes.map(recipe => recipe.name);
    }

    async getAll(paginationDto: PaginationDto): Promise<PaginatedResultDto<Recipe>> {
        const { page, limit } = paginationDto;
        const [recipes, total] = await this.recipeRepository.findAndCount({
            relations: { createdByUser: true, recipeTags: true, ingredients: true, category: true, imageData: true},
            skip: (page - 1) * limit,
            take: limit,
        });

        const lastPage = Math.ceil(total / limit);
        const nextPage = page < lastPage ? page + 1 : null;
        const prevPage = page > 1 ? page - 1 : null;

        return {
            data: recipes,
            meta: {
                total,
                page,
                limit,
                lastPage,
            },
            links: {
                first: `/recipes?page=1&limit=${limit}`,
                previous: prevPage ? `/recipes?page=${prevPage}&limit=${limit}` : undefined,
                next: nextPage ? `/recipes?page=${nextPage}&limit=${limit}` : undefined,
                last: `/recipes?page=${lastPage}&limit=${limit}`,
            },
        };
    }

    async create(createRecipeDto: CreateRecipeDto) {
        const user = await this.userRepository.findOneBy({ username: createRecipeDto.createdByUser});
        if (!user) {
            throw new NotFoundException(`user with username '${createRecipeDto.createdByUser}' does not exist`);
        }

        const recipeImage = await this.imageRepository.findOneBy({ id: createRecipeDto.imageId });
        if (!recipeImage) {
            throw new NotFoundException(`image with id '${createRecipeDto.imageId}' does not exist`);
        }

        const category = await this.categoryRepository.findOneBy ({ id: createRecipeDto.categoryId} );
        if (!category) {
            throw new NotFoundException(`Category with id '${createRecipeDto.categoryId}' does not exist`);
        }

        const recipe = new Recipe();
        recipe.createdByUser = user;
        recipe.name = createRecipeDto.name;
        recipe.description = createRecipeDto.description;
        recipe.ingredients = [];
        recipe.instructions = createRecipeDto.instructions;
        recipe.prepTime = createRecipeDto.prepTime;
        recipe.cookTime = createRecipeDto.cookingTime;
        recipe.servings = createRecipeDto.servings;
        recipe.recipeTags = [];
        recipe.category = category;
        recipe.createdAt = new Date();
        recipe.imageData = recipeImage;

        for (const id of createRecipeDto.ingredientIds) {
            const ingredient = await this.ingredientRepository.findOneBy({id: id} )
            if (!ingredient) {
                throw new NotFoundException(`Tag with id '${id}' does not exist`);
            }
            recipe.ingredients.push(ingredient);
        }

        for (const tagId of createRecipeDto.recipeTagIds) {
            const tag = await this.recipeTagRepository.findOneBy({ id: tagId });
            if (!tag) {
                throw new NotFoundException(`Tag with id '${tagId}' does not exist`);
            }
            recipe.recipeTags.push(tag);
        }

        await this.recipeRepository.save(recipe);
        return recipe;
    }

    async update(username: string, id: number, updateRecipeDto: UpdateRecipeDto): Promise<Recipe> {
        const recipe = await this.recipeRepository.findOne({
            where: { id },
            relations: { createdByUser: true, recipeTags: true, ingredients: true, category: true, imageData: true}
        });

        if (!recipe) {
            throw new NotFoundException(`Recipe with id '${id}' does not exist`);
        }

        const user = await this.userRepository.findOneBy({ username: username });
        if (!user || recipe.createdByUser !== user) {
            throw new NotFoundException(`User with name '${username}' can't update this recipe`);
        }

        if (updateRecipeDto.title !== undefined) {
            recipe.name = updateRecipeDto.title;
        }
        if (updateRecipeDto.description !== undefined) {
            recipe.description = updateRecipeDto.description;
        }
        if (updateRecipeDto.instructions !== undefined) {
            recipe.instructions = updateRecipeDto.instructions;
        }
        if (updateRecipeDto.prepTime !== undefined) {
            recipe.prepTime = updateRecipeDto.prepTime;
        }
        if (updateRecipeDto.cookTime !== undefined) {
            recipe.cookTime = updateRecipeDto.cookTime;
        }
        if (updateRecipeDto.servings !== undefined) {
            recipe.servings = updateRecipeDto.servings;
        }

        if (updateRecipeDto.ingredients !== undefined) {
            recipe.ingredients = updateRecipeDto.ingredients.map(ingredientDto => {
                const ingredient = new Ingredient();
                ingredient.name = ingredientDto.name;
                return ingredient;
            });
        }

        if (updateRecipeDto.tags !== undefined) {
            recipe.recipeTags = await Promise.all(
                updateRecipeDto.tags.map(async tagDto => {
                    const tag = await this.recipeTagRepository.findOneBy({id: tagDto.id});
                    if (!tag) {
                        throw new NotFoundException(`Tag with id '${tagDto.id}' does not exist`);
                    }
                    return tag;
                }),
            );
        }

        if (updateRecipeDto.categoryId !== undefined) {
            const category = await this.categoryRepository.findOneBy({ id: updateRecipeDto.categoryId });
            if (!category) {
                throw new NotFoundException(`Category with id '${updateRecipeDto.categoryId}' does not exist`);
            }
            recipe.category = category;
        }

        if (updateRecipeDto.imageData !== undefined) {
            const image = await this.imageRepository.findOneBy({ id: updateRecipeDto.imageData.id });
            if (!image) {
                throw new NotFoundException(`image with id '${updateRecipeDto.imageData.id}' does not exist`);
            }
            recipe.imageData = image;
        }

        recipe.updatedAt = new Date();

        await this.recipeRepository.save(recipe);
        return recipe;
    }

    async delete(username: string, id: number) {
        const user = await this.userRepository.findOneBy({ username: username });
        if (!user) {
            throw new NotFoundException(`User with name '${username}' does not exist`);
        }

        const recipe = await this.recipeRepository.findOne({ where: {id}, relations: { createdByUser: true } });
        if (!recipe) {
            throw new NotFoundException(`Recipe with id '${id}' does not exist`);
        }

        if (recipe.createdByUser?.username !== username) {
            throw new ForbiddenException(`User can't delete project with id ${id}`);
        }

        await this.recipeRepository.delete(id);
    }
}