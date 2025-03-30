import {Injectable, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Note } from './entities/note.entity';
import { NoteDto } from './dto/note.dto';
import { User } from '../users/entities/user.entity';
import {CreateNoteDto} from "./dto/crete-note.dto";
import {UpdateNoteDto} from "./dto/update-note.dto";

@Injectable()
export class NotesService {
    constructor(
        @InjectRepository(Note)
        private readonly noteRepository: Repository<Note>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async createNote(noteDto: CreateNoteDto): Promise<Note> {
        const user = await this.userRepository.findOneBy({ username: noteDto.createdByUser });
        if (!user) {
            throw new Error('User not found');
        }

        const note = new Note();
        note.text = noteDto.text;
        note.createdByUser = user;

        return this.noteRepository.save(note);
    }

    async deleteNote(id: number): Promise<void> {
        const note = await this.noteRepository.findOneBy({ id });
        if (!note) {
            throw new NotFoundException(`Note with id '${id}' does not exist`);
        }

        await this.noteRepository.remove(note);
    }

    async updateNote(noteDto: UpdateNoteDto): Promise<Note> {
        const note = await this.noteRepository.findOneBy({ id: noteDto.id });
        if (!note) {
            throw new NotFoundException(`Note with id '${noteDto.id}' does not exist`);
        }

        note.text = noteDto.text;

        return this.noteRepository.save(note);
    }

    async getNotes(username: string): Promise<Note[]> {
        const user = await this.userRepository.findOneBy({ username: username });
        if (!user) {
            throw new NotFoundException(`User with username '${username}' does not exist`);
        }
        const notes = await this.noteRepository.findBy({ createdByUser: user });
        if (!notes) {
            throw new NotFoundException(`Notes created by user '${username}' does not exist`);
        }
        return notes;
    }
}