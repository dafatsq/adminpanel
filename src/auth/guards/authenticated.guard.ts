import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

// Guard untuk cek apakah user sudah login
@Injectable()
export class AuthenticatedGuard implements CanActivate {
    canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        return request.isAuthenticated();
    }
}
