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
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiBody,
    ApiConsumes,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation
} from "@nestjs/swagger";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {NoteDto} from "../notes/dto/note.dto";

@UseGuards(JwtAuthGuard)
@Controller('images')
export class ImageController {
    constructor(private readonly imageService: ImageService) {}

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    @ApiBadRequestResponse()
    @ApiNotFoundResponse()
    @ApiBearerAuth()
    async deleteImage(@Param('id') id: number) {
        return this.imageService.deleteImage(id);
    }

    @UseGuards(JwtAuthGuard)
    @Post('upload')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Upload an image' })
    @ApiConsumes('multipart/form-data')
    @ApiBadRequestResponse()
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