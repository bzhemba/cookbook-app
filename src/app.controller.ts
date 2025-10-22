import { Controller, Get, Res, Session } from '@nestjs/common';
import { Response } from 'express';
import { ApiExcludeController } from '@nestjs/swagger';
import {
  CustomSession,
  UserSession,
} from './auth/interface/session.interfaces';

@ApiExcludeController()
@Controller()
export class AppController {
  @Get()
  getIndex(@Res() res: Response, @Session() session: UserSession) {
    const isAuthenticated = !!session.user;
    const user = session.user || {};

    return res.render('index.hbs', {
      isAuthenticated,
      user,
    });
  }

  @Get('logout')
  logout(@Res() res: Response, @Session() session: CustomSession) {
    session.destroy((err) => {
      if (err) {
        return res.redirect('/');
      }
      res.clearCookie('connect.sid');
      res.redirect('/');
    });
  }

  @Get('create-recipe')
  getAddPage(@Res() res: Response, @Session() session: UserSession) {
    const isAuthenticated = !!session.user;
    const user = session.user || {};
    const serverLoadTime = 0;
    if (isAuthenticated) {
      return res.render('create-recipe.hbs', {
        isAuthenticated,
        user,
        serverLoadTime,
      });
    } else {
      return res.render('login.hbs');
    }
  }

  @Get('all-recipes')
  getAllRecipesPage(@Res() res: Response, @Session() session: UserSession) {
    const isAuthenticated = !!session.user;
    const user = session.user || {};
    const serverLoadTime = 0;
    res.render('all-recipes.hbs', {
      isAuthenticated,
      user,
      serverLoadTime,
    });
  }

  @Get('notes')
  getNotesPage(@Res() res: Response, @Session() session: UserSession) {
    const isAuthenticated = !!session.user;
    const user = session.user || {};
    if (isAuthenticated) {
      return res.render('notes.hbs', {
        isAuthenticated,
        user,
      });
    } else {
      return res.render('login.hbs');
    }
  }

  @Get('recipe-gallery')
  getGalleryPage(@Res() res: Response, @Session() session: UserSession) {
    const isAuthenticated = !!session.user;
    const user = session.user || {};

    return res.render('recipe-gallery.hbs', {
      isAuthenticated,
      user,
    });
  }

  @Get('table')
  getTablePage(@Res() res: Response, @Session() session: UserSession) {
    const isAuthenticated = !!session.user;
    const user = session.user || {};

    return res.render('table.hbs', {
      isAuthenticated,
      user,
    });
  }

  @Get('profile')
  getProfilePage(@Res() res: Response, @Session() session: UserSession) {
    const isAuthenticated = !!session.user;
    const user = session.user || {};

    return res.render('profile.hbs', {
      isAuthenticated,
      user,
    });
  }

  @Get('index')
  getHomePage(@Res() res: Response, @Session() session: UserSession) {
    const isAuthenticated = !!session.user;
    const user = session.user || {};
    const serverLoadTime = 0;
    return res.render('index.hbs', {
      isAuthenticated,
      user,
      serverLoadTime,
    });
  }

  @Get('recipe-details')
  getDetailsPage(@Res() res: Response, @Session() session: UserSession) {
    const isAuthenticated = !!session.user;
    const user = session.user || {};
    return res.render('recipe-details.hbs', {
      isAuthenticated,
      user,
    });
  }

  @Get('login')
  getLoginPage(@Res() res: Response) {
    return res.render('login.hbs');
  }

  @Get('sign-in')
  getSignInPage(@Res() res: Response) {
    return res.render('sign-in.hbs');
  }
}
