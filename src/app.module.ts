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
import {Category} from "./category/entities/category.entity";
import {Note} from "./notes/entities/note.entity";
import {RecipeTag} from "./recipes/entities/recipe-tag.entity";
import {IngredientsModule} from "./ingredients/ingredients.module";
import {RecipesModule} from "./recipes/recipes.module";
import {UserModule} from "./users/user.module";
import {NotesModule} from "./notes/notes.module";
import {CategoryModule} from "./category/category.module";
import {AuthModule} from "./auth/auth.module";
import {ImageModule} from "./shared/image.module";
import {NotificationModule} from "./notifications/notification.module";
import {GraphQLModule} from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

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
            synchronize: false,
        }),
    }),
        GraphQLModule.forRootAsync<ApolloDriverConfig>({
            imports: [ConfigModule],
            driver: ApolloDriver,
            useFactory: async () => ({
                playground: true,
                uploads: false,
                autoSchemaFile: true,
            }),
        }),
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        ServeStaticModule.forRoot(
            {
                rootPath: join(__dirname, '..', 'public'),
                serveRoot: '/public/',
            }),
        RecipesModule,
        UserModule,
        NotesModule,
        CategoryModule,
        AuthModule,
        ImageModule,
        IngredientsModule,
        NotificationModule
    ],
    controllers: [AppController],
    providers: [AppService],
})

export class AppModule {}

function calculateQueryComplexity(document: any): number {
    // Реализация подсчета сложности
    return 0;
}

