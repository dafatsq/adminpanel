import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { Category } from '../entities/category.entity';
import { Product } from '../entities/product.entity';

@Injectable()
export class SeedService implements OnModuleInit {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
    ) { }

    async onModuleInit() {
        await this.seedUsers();
        await this.seedCategories();
        await this.seedProducts();
    }

    private async seedUsers() {
        const count = await this.userRepository.count();
        if (count > 0) return;

        const hashedPassword = await bcrypt.hash('admin123', 10);
        await this.userRepository.save({
            username: 'admin',
            password: hashedPassword,
            fullName: 'Administrator',
        });
        console.log('✅ Seeded admin user (admin / admin123)');
    }

    private async seedCategories() {
        const count = await this.categoryRepository.count();
        if (count > 0) return;

        const categories = [
            { name: 'Elektronik', description: 'Perangkat elektronik dan gadget' },
            { name: 'Pakaian', description: 'Pakaian pria dan wanita' },
            { name: 'Makanan & Minuman', description: 'Produk makanan dan minuman' },
            { name: 'Olahraga', description: 'Peralatan dan perlengkapan olahraga' },
            { name: 'Buku', description: 'Buku, novel, dan literatur' },
        ];

        await this.categoryRepository.save(categories);
        console.log('✅ Seeded 5 categories');
    }

    private async seedProducts() {
        const count = await this.productRepository.count();
        if (count > 0) return;

        const categories = await this.categoryRepository.find();
        const catMap: Record<string, number> = {};
        categories.forEach((c) => (catMap[c.name] = c.id));

        const products = [
            { name: 'Laptop Gaming ASUS', description: 'Laptop gaming dengan RTX 4060', price: 15000000, stock: 10, categoryId: catMap['Elektronik'] },
            { name: 'Smartphone Samsung Galaxy', description: 'Smartphone flagship terbaru', price: 12000000, stock: 25, categoryId: catMap['Elektronik'] },
            { name: 'Earbuds Bluetooth', description: 'Earbuds wireless noise cancelling', price: 500000, stock: 50, categoryId: catMap['Elektronik'] },
            { name: 'Kaos Polos Premium', description: 'Kaos cotton combed 30s', price: 89000, stock: 100, categoryId: catMap['Pakaian'] },
            { name: 'Celana Jeans Slim Fit', description: 'Celana jeans stretch', price: 250000, stock: 40, categoryId: catMap['Pakaian'] },
            { name: 'Jaket Hoodie', description: 'Jaket hoodie fleece tebal', price: 175000, stock: 60, categoryId: catMap['Pakaian'] },
            { name: 'Kopi Arabika Gayo', description: 'Kopi single origin dari Aceh', price: 85000, stock: 30, categoryId: catMap['Makanan & Minuman'] },
            { name: 'Teh Matcha Organik', description: 'Teh hijau matcha premium', price: 120000, stock: 20, categoryId: catMap['Makanan & Minuman'] },
            { name: 'Madu Hutan Asli', description: 'Madu murni dari hutan Kalimantan', price: 150000, stock: 15, categoryId: catMap['Makanan & Minuman'] },
            { name: 'Sepatu Lari Nike', description: 'Sepatu running dengan foam cushion', price: 1200000, stock: 18, categoryId: catMap['Olahraga'] },
            { name: 'Dumbbell Set 20kg', description: 'Set dumbbell adjustable', price: 450000, stock: 12, categoryId: catMap['Olahraga'] },
            { name: 'Matras Yoga', description: 'Matras yoga anti slip 6mm', price: 150000, stock: 35, categoryId: catMap['Olahraga'] },
            { name: 'Novel Laskar Pelangi', description: 'Novel karya Andrea Hirata', price: 75000, stock: 45, categoryId: catMap['Buku'] },
            { name: 'Buku Pemrograman JavaScript', description: 'Panduan lengkap JavaScript modern', price: 120000, stock: 20, categoryId: catMap['Buku'] },
            { name: 'Komik One Piece Vol. 100', description: 'Manga One Piece volume 100', price: 40000, stock: 80, categoryId: catMap['Buku'] },
        ];

        await this.productRepository.save(products);
        console.log('✅ Seeded 15 products');
    }
}
