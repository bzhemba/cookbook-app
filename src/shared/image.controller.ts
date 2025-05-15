import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ImageService } from './image.service';
import { randomUUID } from 'crypto';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiNotFoundResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { StorageService } from '../storage/storage.service';
@Controller('images')
export class ImageController {
  constructor(
    private readonly imageService: ImageService,
    private readonly storageService: StorageService,
  ) {}

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
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 15 * 1024 * 1024,
      },
      fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (allowedMimeTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new BadRequestException('Invalid file type'), false);
        }
      },
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const fileExtension = file.originalname.split('.').pop();
    const fileName = `${randomUUID()}.${fileExtension}`;

    const uploadResult = await this.storageService.uploadFile(file, fileName);

    const imageUrl = uploadResult.Key;
    return this.imageService.createImage(imageUrl);
  }

  @Get(':key')
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  async getImageUrl(@Param('key') key: string): Promise<string> {
    return await this.storageService.getFileUrl(key);
  }
}
