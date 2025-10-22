import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { CollectionsService } from './collections.service';
import { CollectionDto } from './dto/collection.dto';
import { Collection } from './entities/collection.entity';
import { WriteCollectionDto } from './dto/write-collection.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Controller('collections')
export class CollectionsController {
  constructor(
    private readonly collectionsService: CollectionsService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Get('id/:id')
  @ApiResponse({ status: 200, type: [CollectionDto] })
  async getCollectionById(@Param('id') id: number): Promise<Collection | null> {
    return this.collectionsService.getCollectionById(id);
  }

  @Post()
  @ApiResponse({ status: 200, type: CollectionDto })
  async createCollection(@Body() dto: WriteCollectionDto) {
    const collection = await this.collectionsService.createCollection(dto);

    this.eventEmitter.emit('collections', {
      type: 'COLLECTION_CREATED',
      data: collection,
    });

    return collection;
  }

  @Delete(':id')
  async deleteCollection(@Param('id') id: number): Promise<void> {
    return this.collectionsService.deleteCollection(id);
  }

  @Put(':id/name')
  @ApiResponse({ status: 200, type: CollectionDto })
  async renameCollection(@Param('id') id: number, @Body() newName: string) {
    await this.collectionsService.renameCollection(id, newName);
  }

  @Post('save/:id/:recipeId')
  async addRecipeToCollection(
    @Param('id') id: number,
    @Param('recipeId') recipeId: number,
  ): Promise<void> {
    await this.collectionsService.addRecipeToCollection(id, recipeId);

    this.eventEmitter.emit('collections', {
      type: 'COLLECTION_UPDATED',
    });
  }

  @Delete(':id/recipes/:recipeId')
  async removeRecipeFromCollection(
    @Param('id') id: number,
    @Param('recipeId') recipeId: number,
  ): Promise<void> {
    return this.collectionsService.removeRecipeFromCollection(id, recipeId);
  }

  @Get(':username')
  @ApiResponse({ status: 200, type: [CollectionDto] })
  async getUserCollections(
    @Param('username') username: string,
  ): Promise<Collection[]> {
    return this.collectionsService.getUserCollections(username);
  }
}
