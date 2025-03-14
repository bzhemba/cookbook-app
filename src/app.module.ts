import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import {join} from "path";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Image} from "./shared/entities/image.entity";
import {User} from "./users/entities/user.entity";
import {Recipe} from "./recipes/entities/recipe.entity";
import {Ingredient} from "./ingredients/entities/ingredient.entity";
import {RecipeTag} from "./tag/entities/recipe-tag.entity";
import {Category} from "./category/entities/category.entity";
import {Note} from "./notes/entities/note.entity";

@Module({
    imports: [TypeOrmModule.forRootAsync({
        useFactory: () => ({
            type: 'postgres',
            host: process.env.DB_HOST,
            port: 21403,
            username: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            ssl: true,
            extra: {
                ssl: {
                    "rejectUnauthorized": false
                }
            },
            entities: [User, Image, Category, Note, Recipe, Ingredient, RecipeTag],
            synchronize: true,
        }),
    }),
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        ServeStaticModule.forRoot(
            {
                rootPath: join(__dirname, '..', 'public'),
                serveRoot: '/public/',
            })
    ],
    controllers: [AppController],
    providers: [AppService],
})

export class AppModule {}

