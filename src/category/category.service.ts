import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Category } from '../entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
    ) { }

    async findAll(search?: string): Promise<Category[]> {
        if (search) {
            return this.categoryRepository.find({
                where: { name: Like(`%${search}%`) },
                relations: ['products'],
                order: { createdAt: 'DESC' },
            });
        }
        return this.categoryRepository.find({
            relations: ['products'],
            order: { createdAt: 'DESC' },
        });
    }

    async findOne(id: number): Promise<Category | null> {
        return this.categoryRepository.findOne({
            where: { id },
            relations: ['products'],
        });
    }

    async create(dto: CreateCategoryDto): Promise<Category> {
        const category = this.categoryRepository.create(dto);
        return this.categoryRepository.save(category);
    }

    async update(id: number, dto: CreateCategoryDto): Promise<Category> {
        await this.categoryRepository.update(id, dto);
        return this.findOne(id) as Promise<Category>;
    }

    async remove(id: number): Promise<void> {
        await this.categoryRepository.delete(id);
    }

    async count(): Promise<number> {
        return this.categoryRepository.count();
    }
}
