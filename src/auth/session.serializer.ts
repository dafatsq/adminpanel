import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { User } from '../entities/user.entity';

@Injectable()
export class SessionSerializer extends PassportSerializer {
    constructor(private readonly authService: AuthService) {
        super();
    }

    serializeUser(
        user: User,
        done: (err: Error | null, user: any) => void,
    ): void {
        done(null, { id: user.id, username: user.username, fullName: user.fullName });
    }

    async deserializeUser(
        payload: any,
        done: (err: Error | null, payload: any) => void,
    ): Promise<void> {
        const user = await this.authService.findById(payload.id);
        done(null, user || payload);
    }
}
