import {Body, Controller, Delete, Param, Patch, Post} from '@nestjs/common';
import { NotesService } from './notes.service';
import { NoteDto } from './dto/note.dto';

@Controller('notes')
export class NotesController {
    constructor(private readonly notesService: NotesService) {}

    @Post()
    async createNote(@Body() noteDto: NoteDto) {
        return this.notesService.createNote(noteDto);
    }

    @Delete(':id')
    async deleteNote(@Param('id') id: number) {
        return this.notesService.deleteNote(id);
    }

    @Patch(':id')
    async updateNote(
        @Param('id') id: number,
        @Body() noteDto: NoteDto,
    ) {
        return this.notesService.updateNote(id, noteDto);
    }
}