import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "../users/entities/user.entity";
import {AutoMapper} from "nestjsx-automapper";
import {NotesController} from "./notes.controller";
import {NotesService} from "./notes.service";

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    controllers: [NotesController],
    providers: [NotesService, AutoMapper]
})

export class NotesModule {}