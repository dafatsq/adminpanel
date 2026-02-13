import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity.js';
import { Category } from '../entities/category.entity.js';
import { Product } from '../entities/product.entity.js';
import { SeedService } from './seed.service.js';

@Module({
    imports: [TypeOrmModule.forFeature([User, Category, Product])],
    providers: [SeedService],
})
export class SeedModule { }
