import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { AuthService } from './auth.service.js';

@Injectable()
export class SessionSerializer extends PassportSerializer {
    constructor(private authService: AuthService) {
        super();
    }

    // Simpan data user ke session
    serializeUser(user: any, done: Function) {
        done(null, { id: user.id, username: user.username, fullName: user.fullName });
    }

    // Ambil data user dari session
    async deserializeUser(payload: any, done: Function) {
        const user = await this.authService.findById(payload.id);
        done(null, user || payload);
    }
}
