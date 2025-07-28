import {Injectable, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import { Recipe } from '../recipes/entities/recipe.entity';
import {Collection} from "./entities/collection.entity";
import {WriteCollectionDto} from "./dto/write-collection.dto";
import {CollectionRecipe} from "./entities/collection-recipe.entity";
import {User} from "../users/entities/user.entity";

@Injectable()
export class CollectionsService {
    constructor(
        @InjectRepository(Collection)
        private readonly collectionRepository: Repository<Collection>,
        @InjectRepository(CollectionRecipe)
        private readonly collectionRecipeRepository: Repository<CollectionRecipe>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Recipe)
        private readonly recipeRepository: Repository<Recipe>,
    ) {}

    async createCollection(dto: WriteCollectionDto): Promise<Collection> {
        const user = await this.userRepository.findOneBy({
            username: dto.createdByUser,
        });
        if (!user) {
            throw new NotFoundException(
                `user with username '${dto.createdByUser}' does not exist`,
            );
        }
        const collection = this.collectionRepository.create({ name: dto.name, createdByUser: user });

        return await this.collectionRepository.save(collection);
    }

    async deleteCollection(collectionId: number): Promise<void> {
        const collection = await this.collectionRepository.findOne({
            where: { id: collectionId },
        });

        if (!collection) {
            throw new Error('Collection not found or access denied');
        }

        await this.collectionRepository.delete(collectionId);
    }

    async renameCollection(collectionId: number, newName: string): Promise<void> {
        const collection = await this.collectionRepository.findOne({
            where: { id: collectionId }
        });

        if (!collection) {
            throw new Error('Collection not found or access denied');
        }

        collection.name = newName;
        await this.collectionRepository.save(collection);
    }
    async addRecipeToCollection(collectionId: number, recipeId: number): Promise<void> {
        const collection = await this.collectionRepository.findOne({
            where: { id: collectionId },
            relations: ['createdByUser'],
        });

        if (!collection) {
            throw new Error('Collection not found or access denied');
        }

        const recipe = await this.recipeRepository.findOneBy({ id: recipeId });
        if (!recipe) {
            throw new Error('Recipe not found');
        }

        const exists = await this.collectionRecipeRepository.findOneBy({
            collectionId,
            recipeId: recipeId
        });

        if (exists) {
            return;
        }

        const collectionRecipe = this.collectionRecipeRepository.create({
            collectionId,
            recipeId: recipeId,
        });

        await this.collectionRecipeRepository.save(collectionRecipe);
    }

    async removeRecipeFromCollection(collectionId: number, recipeId: number): Promise<void> {
        const collection = await this.collectionRepository.findOne({
            where: { id: collectionId },
            relations: ['createdByUser'],
        });

        if (!collection) {
            throw new Error('Collection not found or access denied');
        }

        await this.collectionRecipeRepository.delete({
            collectionId,
            recipeId
        });
    }

    async getUserCollections(username: string): Promise<Collection[]> {
        return this.collectionRepository.find({
            where: { createdByUser: { username } },
            relations: ['createdByUser', 'recipesConnection', 'recipesConnection.recipe', 'recipesConnection.recipe.imageData'],
        });
    }

    async getCollectionById(id: number): Promise<Collection | null> {
        return this.collectionRepository.findOne({
            where: { id: id  },
            relations: ['createdByUser', 'recipesConnection', 'recipesConnection.recipe', 'recipesConnection.recipe.imageData'],
        });
    }
}
