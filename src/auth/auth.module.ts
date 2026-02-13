import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './local.strategy';
import { SessionSerializer } from './session.serializer';

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
