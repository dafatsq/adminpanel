import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity.js';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { LocalStrategy } from './local.strategy.js';
import { SessionSerializer } from './session.serializer.js';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        PassportModule.register({ session: true }),
    ],
    providers: [AuthService, LocalStrategy, SessionSerializer],
    controllers: [AuthController],
    exports: [AuthService],
})
export class AuthModule { }
