import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {RecipesController} from "../recipes/recipes.controller";
import {AutoMapper} from "nestjsx-automapper";
import {ImageService} from "./image.service";
import {Image} from "./entities/image.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Image])],
    controllers: [RecipesController],
    providers: [ImageService, AutoMapper]
})

export class ImageModule {}