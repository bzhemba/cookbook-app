import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import {join} from "path";
import {AuthController} from "./auth/auth.controller";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Category} from "./category/entities/category.entity";
import {Picture} from "./shared/entities/picture.entity";
import {User} from "./users/entities/user.entity";
import {Note} from "./notes/entities/note.entity";
import {Recipe} from "./recipes/entities/recipe.entity";
import {Ingredient} from "./ingredients/entities/ingredient.entity";
import {Tag} from "./tag/entities/tag.entity";

@Module({
  imports: [TypeOrmModule.forRootAsync({
    useFactory: () => ({
      type: 'postgres',
      host: 'pg-312f80b1-cookbook-web-app.g.aivencloud.com',
      port: 21403,
      username: 'avnadmin',
      password: 'AVNS_hohf2hoX084NWjDqZfI',
      database: 'defaultdb',
      ssl: true,
      extra: {
        ssl: {
          "rejectUnauthorized": false
        }
      },
      entities: [User, Picture, Category, Note, Recipe, Ingredient, Tag],
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

