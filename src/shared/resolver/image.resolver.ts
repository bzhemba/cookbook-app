// import { Args, Mutation, Resolver } from '@nestjs/graphql';
// import {ImageService} from "../image.service";
// import GraphQLUpload from 'graphql-upload';
// import FileUpload from 'graphql-upload';
// import { createWriteStream } from 'fs'; // Добавляем этот импорт
//
// @Resolver('Image')
// export class ImageResolver {
//     constructor(private readonly imageService: ImageService) {}
//
//     @Mutation(() => Boolean)
//     async deleteImage(@Args('id') id: number) {
//         await this.imageService.deleteImage(id);
//     }
//
//     @Mutation(() => String) // Возвращаем URL загруженного изображения
//     async uploadImage(@Args({ name: 'file', type: () => GraphQLUpload }) file: FileUpload){
//         const uploadDir = './uploads';
//         const imageUrl = `/uploads/filename`;
//         const path = `${uploadDir}/filename`;
//
//         return await this.imageService.createImage(imageUrl);
//     }
// }