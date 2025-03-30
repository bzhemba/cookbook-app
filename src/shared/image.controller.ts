import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Req,
    UploadedFile,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import { ImageService } from './image.service';
import { diskStorage } from 'multer';
import {FileInterceptor} from "@nestjs/platform-express";
import { Request } from 'express';
import {ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation} from "@nestjs/swagger";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";

@UseGuards(JwtAuthGuard)
@Controller('images')
export class ImageController {
    constructor(private readonly imageService: ImageService) {}

    @Delete(':id')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async deleteImage(@Param('id') id: number) {
        return this.imageService.deleteImage(id);
    }

    @Post('upload')
    @ApiOperation({ summary: 'Upload an image' })
    @ApiConsumes('multipart/form-data')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, callback) => {
                return callback(null, `${file.originalname}`);
            },
        }),
    }))
    async uploadFile(@UploadedFile() file: Express.Multer.File) {

        const imageUrl = `/uploads/${file.filename}`;

        return this.imageService.createImage(imageUrl);
    }
}