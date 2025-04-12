import {Args, Mutation, Query, Resolver} from "@nestjs/graphql";
import {RecipeDto} from "../../recipes/dto/recipe.dto";
import {NoteDto} from "../dto/note.dto";
import {NotesService} from "../notes.service";
import {CreateNoteDto} from "../dto/crete-note.dto";
import {UpdateNoteDto} from "../dto/update-note.dto";

@Resolver(() => NoteDto)
export class NoteResolver {
    constructor(private readonly notesService: NotesService) {}

    @Query(() => [NoteDto], { name: 'notes' })
    async getAllNotes(@Args('username') username: string) {
        return this.notesService.getNotes(username);
    }


    @Mutation(() => NoteDto)
    async createNote(@Args('input') input: CreateNoteDto) {
        return await this.notesService.createNote(input);
    }

    @Mutation(() => NoteDto)
    async updateNote(@Args('input') input: UpdateNoteDto) {
        return this.notesService.updateNote(input);
    }
}