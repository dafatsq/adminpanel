import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import * as express from 'express';
import { LoginGuard } from './guards/login.guard.js';

@Controller()
export class AuthController {
    // Tampilkan halaman login
    @Get('login')
    loginPage(@Req() req: express.Request, @Res() res: express.Response) {
        // Kalau sudah login, redirect ke dashboard
        if (req.isAuthenticated()) {
            return res.redirect('/');
        }
        return res.render('login', {
            layout: false,
            error: req.query.error || null,
        });
    }

    // Proses login (pakai Passport)
    @UseGuards(LoginGuard)
    @Post('login')
    login(@Res() res: express.Response) {
        return res.redirect('/');
    }

    // Logout
    @Get('logout')
    logout(@Req() req: express.Request, @Res() res: express.Response) {
        req.logout(() => {
            res.redirect('/login');
        });
    }
}
