import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Product } from '../entities/product.entity.js';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product)
        private productRepo: Repository<Product>,
    ) { }

    // Ambil semua produk (bisa filter pakai search)
    async findAll(search?: string) {
        if (search) {
            return this.productRepo.find({
                where: { name: Like(`%${search}%`) },
                relations: ['category'],
            });
        }
        return this.productRepo.find({ relations: ['category'] });
    }

    // Ambil satu produk berdasarkan ID
    async findOne(id: number) {
        return this.productRepo.findOne({
            where: { id },
            relations: ['category'],
        });
    }

    // Buat produk baru
    async create(data: {
        name: string;
        description?: string;
        price: number;
        stock: number;
        categoryId: number;
    }) {
        const product = this.productRepo.create(data);
        return this.productRepo.save(product);
    }

    // Update produk
    async update(id: number, data: any) {
        await this.productRepo.update(id, data);
        return this.findOne(id);
    }

    // Hapus produk
    async remove(id: number) {
        return this.productRepo.delete(id);
    }

    // Hitung total produk
    async count() {
        return this.productRepo.count();
    }
}
