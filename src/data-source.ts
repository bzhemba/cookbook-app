// import { DataSource } from "typeorm";
// import {User} from "./users/entities/user.entity";
// import {Picture} from "./shared/entities/picture.entity";
// import {Category} from "./category/entities/category.entity";
// import {Note} from "./notes/entities/note.entity";
// import {Recipe} from "./recipes/entities/recipe.entity";
// import {Ingredient} from "./ingredients/entities/ingredient.entity";
//
// export default new DataSource({
//     type: 'postgres',
//     host: process.env.HOST,
//     port: process.env.DB_PORT,
//     username: process.env.USER,
//     password: process.env.PASSWORD,
//     database: process.env.DATABASE,
//     entities: [User, Picture, Category, Note, Recipe, Ingredient],
//     migrations: ["1740758774561-init_1.ts"],
//     migrationsTableName: "migration_table",
// })