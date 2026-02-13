import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn,
} from 'typeorm';
import { Category } from './category.entity.js';

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'decimal', default: 0 })
    price: number;

    @Column({ type: 'int', default: 0 })
    stock: number;

    @Column()
    categoryId: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    // Relasi: banyak produk milik satu kategori
    @ManyToOne(() => Category, (category) => category.products, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'categoryId' })
    category: Category;
}
