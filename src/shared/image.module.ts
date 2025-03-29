import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {RecipesController} from "../recipes/recipes.controller";
import {AutoMapper} from "nestjsx-automapper";
import {ImageService} from "./image.service";
import {Image} from "./entities/image.entity";
import {ImageController} from "./image.controller";

@Module({
    imports: [TypeOrmModule.forFeature([Image])],
    controllers: [ImageController],
    providers: [ImageService, AutoMapper]
})

export class ImageModule {}