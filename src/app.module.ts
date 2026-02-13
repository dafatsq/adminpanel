import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity.js';
import { Category } from './entities/category.entity.js';
import { Product } from './entities/product.entity.js';
import { AuthModule } from './auth/auth.module.js';
import { CategoryModule } from './category/category.module.js';
import { ProductModule } from './product/product.module.js';
import { SeedModule } from './seed/seed.module.js';
import { AppController } from './app.controller.js';

@Module({
  imports: [
    // Koneksi database SQLite
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [User, Category, Product],
      synchronize: true, // otomatis buat tabel
    }),
    AuthModule,
    CategoryModule,
    ProductModule,
    SeedModule,
  ],
  controllers: [AppController],
})
export class AppModule { }
