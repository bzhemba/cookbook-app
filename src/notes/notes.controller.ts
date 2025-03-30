import {Body, Controller, Delete, Get, Param, Post, Put} from '@nestjs/common';
import { NotesService } from './notes.service';
import {CreateNoteDto} from "./dto/crete-note.dto";
import {UpdateNoteDto} from "./dto/update-note.dto";
import { EventEmitter2 } from '@nestjs/event-emitter';

@Controller('notes')
export class NotesController {
    constructor(private readonly notesService: NotesService, private eventEmitter: EventEmitter2,) {}

    @Post()
    async createNote(@Body() noteDto: CreateNoteDto) {
        const note = await this.notesService.createNote(noteDto);
        this.eventEmitter.emit('notes', {
            type: 'NOTE_CREATED',
            note: note
        });
        return note;
    }

    @Get(':username')
    async getNotesByUser(@Param('username') username: string) {
        return this.notesService.getNotes(username);
    }

    @Delete(':id')
    async deleteNote(@Param('id') id: number) {
        await this.notesService.deleteNote(id);
        this.eventEmitter.emit('notes', {
            type: 'NOTE_DELETED',
        });
    }

    @Put()
    async updateNote(@Body() noteDto: UpdateNoteDto) {
        const note = await this.notesService.updateNote(noteDto);
        this.eventEmitter.emit('notes', {
            type: 'NOTE_UPDATED',
            note: note
        });
    }
}