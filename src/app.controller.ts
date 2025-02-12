import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import {join} from "path";

@Controller()
export class AppController {
  @Get()
  getIndex(@Res() res: Response) {
    res.sendFile(join(__dirname, '..', 'public', 'pages', 'index.html'));
  }
  @Get('add-recipe.html')
  getAddPage(@Res() res: Response) {
    res.sendFile(join(__dirname, '..', 'public', 'pages', 'add-recipe.html'));
  }

  @Get('all-recipes.html')
  getAllRecipesPage(@Res() res: Response) {
    res.sendFile(join(__dirname, '..', 'public', 'pages', 'all-recipes.html'));
  }

  @Get('notes.html')
  getNotesPage(@Res() res: Response) {
    res.sendFile(join(__dirname, '..', 'public', 'pages', 'notes.html'));
  }

  @Get('recipe-gallery.html')
  getGalleryPage(@Res() res: Response) {
    res.sendFile(join(__dirname, '..', 'public', 'pages', 'recipe-gallery.html'));
  }

  @Get('table.html')
  getTablePage(@Res() res: Response) {
    res.sendFile(join(__dirname, '..', 'public', 'pages', 'table.html'));
  }

  @Get('index.html')
  getHomePage(@Res() res: Response) {
    res.sendFile(join(__dirname, '..', 'public', 'pages', 'index.html'));
  }
}

