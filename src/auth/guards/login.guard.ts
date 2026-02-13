import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Guard khusus untuk proses login
@Injectable()
export class LoginGuard extends AuthGuard('local') {
    // Override handleRequest supaya bisa redirect kalau gagal login
    handleRequest(err, user, info, context) {
        if (err || !user) {
            const response = context.switchToHttp().getResponse();
            return response.redirect('/login?error=Username atau password salah');
        }
        return user;
    }

    async canActivate(context: ExecutionContext) {
        const result = (await super.canActivate(context)) as boolean;
        const request = context.switchToHttp().getRequest();
        await super.logIn(request);
        return result;
    }
}
