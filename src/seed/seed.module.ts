import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Category } from '../entities/category.entity';
import { Product } from '../entities/product.entity';
import { SeedService } from './seed.service';

@Module({
    imports: [TypeOrmModule.forFeature([User, Category, Product])],
    providers: [SeedService],
})
export class SeedModule { }
