import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Category } from '../entities/category.entity.js';

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Category)
        private categoryRepo: Repository<Category>,
    ) { }

    // Ambil semua kategori (bisa filter pakai search)
    async findAll(search?: string) {
        if (search) {
            return this.categoryRepo.find({
                where: { name: Like(`%${search}%`) },
                relations: ['products'],
            });
        }
        return this.categoryRepo.find({ relations: ['products'] });
    }

    // Ambil satu kategori berdasarkan ID
    async findOne(id: number) {
        return this.categoryRepo.findOne({
            where: { id },
            relations: ['products'],
        });
    }

    // Buat kategori baru
    async create(data: { name: string; description?: string }) {
        const category = this.categoryRepo.create(data);
        return this.categoryRepo.save(category);
    }

    // Update kategori
    async update(id: number, data: { name?: string; description?: string }) {
        await this.categoryRepo.update(id, data);
        return this.findOne(id);
    }

    // Hapus kategori
    async remove(id: number) {
        return this.categoryRepo.delete(id);
    }

    // Hitung total kategori
    async count() {
        return this.categoryRepo.count();
    }
}
