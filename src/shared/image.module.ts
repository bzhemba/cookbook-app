import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {AutoMapper} from "nestjsx-automapper";
import {ImageService} from "./image.service";
import {Image} from "./entities/image.entity";
import {ImageController} from "./image.controller";
import {StorageModule} from "../storage/storage.module";

@Module({
    imports: [StorageModule, TypeOrmModule.forFeature([Image])],
    controllers: [ImageController],
    providers: [ImageService, AutoMapper]
})

export class ImageModule {}