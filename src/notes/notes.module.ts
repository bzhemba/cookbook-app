import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { AutoMapper } from 'nestjsx-automapper';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';
import { Note } from './entities/note.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Note])],
  controllers: [NotesController],
  providers: [NotesService, AutoMapper],
})
export class NotesModule {}
