import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity.js';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepo: Repository<User>,
    ) { }

    // Cek username dan password saat login
    async validateUser(username: string, password: string) {
        const user = await this.userRepo.findOne({ where: { username } });
        if (user && (await bcrypt.compare(password, user.password))) {
            return user;
        }
        return null;
    }

    // Cari user berdasarkan id
    async findById(id: number) {
        return this.userRepo.findOne({ where: { id } });
    }

    // Buat user baru (untuk seeder)
    async createUser(username: string, password: string, fullName: string) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = this.userRepo.create({
            username,
            password: hashedPassword,
            fullName,
        });
        return this.userRepo.save(user);
    }
}
