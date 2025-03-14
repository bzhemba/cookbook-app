import {Injectable, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {Image} from "./entities/image.entity";
import {ImageDto} from "./dtos/image.dto";


@Injectable()
export class ImageService {
    constructor(
        @InjectRepository(Image)
        private readonly imageRepository: Repository<Image>,
    ) {}

    async createImage(imageDto: ImageDto): Promise<Image> {
        const image = new Image();
        image.imageData = imageDto.imageData;

        return this.imageRepository.save(image);
    }

    async deleteImage(id: number): Promise<void> {
        const image = await this.imageRepository.findOneBy({ id });
        if (!image) {
            throw new NotFoundException(`Image with id '${id}' does not exist`);
        }

        await this.imageRepository.remove(image);
    }
}