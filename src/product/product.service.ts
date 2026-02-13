import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Product } from '../entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
    ) { }

    async findAll(search?: string): Promise<Product[]> {
        const queryOptions: any = {
            relations: ['category'],
            order: { createdAt: 'DESC' },
        };

        if (search) {
            queryOptions.where = { name: Like(`%${search}%`) };
        }

        return this.productRepository.find(queryOptions);
    }

    async findOne(id: number): Promise<Product | null> {
        return this.productRepository.findOne({
            where: { id },
            relations: ['category'],
        });
    }

    async create(dto: CreateProductDto): Promise<Product> {
        const product = this.productRepository.create(dto);
        return this.productRepository.save(product);
    }

    async update(id: number, dto: CreateProductDto): Promise<Product> {
        await this.productRepository.update(id, dto);
        return this.findOne(id) as Promise<Product>;
    }

    async remove(id: number): Promise<void> {
        await this.productRepository.delete(id);
    }

    async count(): Promise<number> {
        return this.productRepository.count();
    }
}
