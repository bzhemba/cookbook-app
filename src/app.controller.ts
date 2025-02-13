import {Controller, Get, Post, Render, Req, Res, Session, UseGuards} from '@nestjs/common';
import {Response} from 'express';
import {join} from "path";
import {Auth0Guard} from "./auth/auth0.guard";
import * as Console from "node:console";

@Controller()
export class AppController {
    @Get()
    getIndex(@Res() res: Response, @Session() session: any) {
        const isAuthenticated = !!session.user;
        const user = session.user || {};

        return res.render('index.hbs', {
            isAuthenticated,
            user,
        });
    }

    @Get('login')
    login(@Res() res: Response, @Session() session: any) {
        session.user = {id: 1, username: 'example'};
        return res.redirect('/');
    }

    @Get('logout')
    logout(@Res() res: Response, @Session() session: any) {
        session.destroy((err) => {
            if (err) {
                return res.redirect('/');
            }
            res.clearCookie('connect.sid');
            res.redirect('/');
        });
    }

    @Get('add-recipe')
    getAddPage(@Res() res: Response) {
        return res.render('add-recipe.hbs');
    }

    @Get('all-recipes')
    getAllRecipesPage(@Res()
                          res: Response
    ) {
        return res.render('all-recipes.hbs');
    }

    @Get('notes')
    getNotesPage(@Res()
                     res: Response
    ) {
        return res.render('notes.hbs');
    }

    @Get('recipe-gallery')
    getGalleryPage(@Res()
                       res: Response
    ) {
        const data = {
            columns: [
                {
                    images: [
                        {
                            src: "https://i.pinimg.com/736x/af/11/0d/af110db9108b982ee0bf87f821668e90.jpg",
                            title: "Image title 1"
                        },
                        {
                            src: "https://i.pinimg.com/originals/02/69/0a/02690a2cd081f1865290ce3b2a112a5e.jpg",
                            title: "Image title 2"
                        },
                        {
                            src: "https://i.pinimg.com/736x/fe/19/ec/fe19ec79e3f3d08a21781bf166456382--baking-cookies-tiny-kitchens.jpg",
                            title: "Image title 3"
                        }
                    ]
                },
                {
                    images: [
                        {
                            src: "https://i.pinimg.com/736x/cd/c9/b0/cdc9b07302b0b1f6125a6fdd72d6425b.jpg",
                            title: "Image title 4"
                        },
                        {
                            src: "https://i.pinimg.com/736x/1d/0b/73/1d0b73ecc969a55fae2be30937b270d7.jpg",
                            title: "Image title 5"
                        },
                        {
                            src: "https://i.pinimg.com/736x/73/64/84/7364841253a134bb470a33d71c18a136.jpg",
                            title: "Image title 6"
                        },
                        {
                            src: "https://img.goodfon.com/original/4804x3203/2/6a/chickpea-food-styling-quail-eggs-quinoa-salad-vegetarian.jpg",
                            title: "Image title 7"
                        }
                    ]
                },
                {
                    images: [
                        {
                            src: "https://i.pinimg.com/736x/a1/f4/36/a1f4364f1e4b1c860ad7da9e729a2d4d.jpg",
                            title: "Image title 8"
                        },
                        {
                            src: "https://i.pinimg.com/550x/fc/4b/23/fc4b23050e1c79c234c4922ce5b227af.jpg",
                            title: "Image title 9"
                        },
                        {
                            src: "https://i.pinimg.com/736x/38/8c/cf/388ccf6ca7472e5bca913e60435cda96.jpg",
                            title: "Image title 10"
                        }
                    ]
                }
            ]
        };
        return res.render('recipe-gallery.hbs', {data});
    }

    @Get('table')
    getTablePage(@Res()
                     res: Response
    ) {
        return res.render('table.hbs');
    }

    @Get('index')
    getHomePage(@Res()
                    res: Response
    ) {
        return res.render('index.hbs');
    }
}

