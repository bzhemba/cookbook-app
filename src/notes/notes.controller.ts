import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/crete-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { NoteDto } from './dto/note.dto';
import { HttpExceptionFilter } from '../shared/ExceptionFilter';

@Controller('notes')
@UseFilters(new HttpExceptionFilter())
export class NotesController {
  constructor(
    private readonly notesService: NotesService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Post()
  @ApiOkResponse({ type: NoteDto })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  async createNote(@Body() noteDto: CreateNoteDto) {
    const note = await this.notesService.createNote(noteDto);
    this.eventEmitter.emit('notes', {
      type: 'NOTE_CREATED',
      note: note,
    });
    return note;
  }

  @Get(':username')
  @ApiOkResponse({ type: [NoteDto] })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  async getNotesByUser(@Param('username') username: string) {
    return this.notesService.getNotes(username);
  }

  @Delete(':id')
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  async deleteNote(@Param('id') id: number) {
    await this.notesService.deleteNote(id);
    this.eventEmitter.emit('notes', {
      type: 'NOTE_DELETED',
    });
  }

  @Put()
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  async updateNote(@Body() noteDto: UpdateNoteDto) {
    const note = await this.notesService.updateNote(noteDto);
    this.eventEmitter.emit('notes', {
      type: 'NOTE_UPDATED',
      note: note,
    });
  }
}
