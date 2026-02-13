import {
    Controller,
    Get,
    Post,
    Req,
    Res,
    UseGuards,
} from '@nestjs/common';
import * as express from 'express';
import { LoginGuard } from './guards/login.guard';

@Controller()
export class AuthController {
    @Get('login')
    getLogin(@Req() req: express.Request, @Res() res: express.Response) {
        if (req.isAuthenticated()) {
            return res.redirect('/');
        }
        const error = req.query.error || null;
        return res.render('login', { layout: false, error });
    }

    @UseGuards(LoginGuard)
    @Post('login')
    postLogin(@Res() res: express.Response) {
        return res.redirect('/');
    }

    @Get('logout')
    logout(@Req() req: express.Request, @Res() res: express.Response) {
        req.logout((err) => {
            if (err) {
                console.error('Logout error:', err);
            }
            req.session.destroy(() => {
                res.redirect('/login');
            });
        });
    }
}
