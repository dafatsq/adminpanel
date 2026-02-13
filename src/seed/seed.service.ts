import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity.js';
import { Category } from '../entities/category.entity.js';
import { Product } from '../entities/product.entity.js';

@Injectable()
export class SeedService implements OnModuleInit {
    constructor(
        @InjectRepository(User) private userRepo: Repository<User>,
        @InjectRepository(Category) private categoryRepo: Repository<Category>,
        @InjectRepository(Product) private productRepo: Repository<Product>,
    ) { }

    async onModuleInit() {
        await this.seedData();
    }

    async seedData() {
        // Cek apakah sudah ada data
        const userCount = await this.userRepo.count();
        if (userCount > 0) return;

        // Buat user admin
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await this.userRepo.save({
            username: 'admin',
            password: hashedPassword,
            fullName: 'Administrator',
        });
        console.log('Seed: user admin berhasil dibuat (admin / admin123)');

        // Buat kategori
        const categories = await this.categoryRepo.save([
            { name: 'Elektronik', description: 'Barang elektronik dan gadget' },
            { name: 'Pakaian', description: 'Baju, celana, dan aksesoris' },
            { name: 'Makanan & Minuman', description: 'Makanan dan minuman' },
            { name: 'Olahraga', description: 'Alat dan perlengkapan olahraga' },
            { name: 'Buku', description: 'Buku dan alat tulis' },
        ]);
        console.log('Seed: 5 kategori berhasil dibuat');

        // Buat produk
        await this.productRepo.save([
            { name: 'Laptop Gaming ASUS', description: 'Laptop gaming dengan RTX 4060', price: 15000000, stock: 10, categoryId: categories[0].id },
            { name: 'Smartphone Samsung Galaxy', description: 'HP Samsung terbaru', price: 12000000, stock: 25, categoryId: categories[0].id },
            { name: 'Earbuds Bluetooth', description: 'Earbuds wireless', price: 500000, stock: 50, categoryId: categories[0].id },
            { name: 'Kaos Polos Premium', description: 'Kaos cotton combed 30s', price: 89000, stock: 100, categoryId: categories[1].id },
            { name: 'Celana Jeans Slim Fit', description: 'Jeans stretch slim fit', price: 250000, stock: 40, categoryId: categories[1].id },
            { name: 'Jaket Hoodie', description: 'Jaket hoodie fleece', price: 175000, stock: 60, categoryId: categories[1].id },
            { name: 'Kopi Arabika Gayo', description: 'Kopi arabika asli Gayo', price: 85000, stock: 30, categoryId: categories[2].id },
            { name: 'Teh Matcha Organik', description: 'Teh matcha import Jepang', price: 120000, stock: 20, categoryId: categories[2].id },
            { name: 'Madu Hutan Asli', description: 'Madu murni dari hutan', price: 150000, stock: 15, categoryId: categories[2].id },
            { name: 'Sepatu Lari Nike', description: 'Sepatu lari untuk marathon', price: 1200000, stock: 18, categoryId: categories[3].id },
            { name: 'Dumbbell Set 20kg', description: 'Set dumbbell untuk home gym', price: 450000, stock: 12, categoryId: categories[3].id },
            { name: 'Matras Yoga', description: 'Matras yoga anti slip', price: 150000, stock: 35, categoryId: categories[3].id },
            { name: 'Novel Laskar Pelangi', description: 'Novel karya Andrea Hirata', price: 75000, stock: 45, categoryId: categories[4].id },
            { name: 'Buku Pemrograman JavaScript', description: 'Belajar JS dari dasar', price: 95000, stock: 30, categoryId: categories[4].id },
            { name: 'Pulpen Pilot', description: 'Pulpen tinta hitam 0.5mm', price: 15000, stock: 200, categoryId: categories[4].id },
        ]);
        console.log('Seed: 15 produk berhasil dibuat');
    }
}
