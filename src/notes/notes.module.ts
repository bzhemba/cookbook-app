import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "../users/entities/user.entity";
import {AutoMapper} from "nestjsx-automapper";
import {NotesController} from "./notes.controller";
import { EventEmitterModule } from '@nestjs/event-emitter';
import {NotesService} from "./notes.service";
import {Note} from "./entities/note.entity";
import {NoteResolver} from "./resolver/note.resolver";

@Module({
    imports: [TypeOrmModule.forFeature([User, Note])],
    controllers: [NotesController],
    providers: [NotesService, AutoMapper, NoteResolver]
})

export class NotesModule {}