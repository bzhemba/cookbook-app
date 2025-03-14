import {Body, Controller, Delete, Param, Post, UseGuards} from '@nestjs/common';
import { ImageService } from './image.service';
import {Auth0Guard} from "../auth/auth0.guard";
import {ImageDto} from "./dtos/image.dto";

@Controller('images')
@UseGuards(Auth0Guard)
export class ImageController {
    constructor(private readonly imageService: ImageService) {}

    @Post()
    async createimage(@Body() imageDto: ImageDto) {
        return this.imageService.createImage(imageDto);
    }

    @Delete(':id')
    async deleteimage(@Param('id') id: number) {
        return this.imageService.deleteImage(id);
    }
}