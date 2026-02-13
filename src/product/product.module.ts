import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../entities/product.entity.js';
import { ProductService } from './product.service.js';
import { ProductController } from './product.controller.js';
import { CategoryModule } from '../category/category.module.js';

@Module({
    imports: [TypeOrmModule.forFeature([Product]), CategoryModule],
    providers: [ProductService],
    controllers: [ProductController],
    exports: [ProductService],
})
export class ProductModule { }
