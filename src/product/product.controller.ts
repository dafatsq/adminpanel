import {
    Controller,
    Get,
    Post,
    Req,
    Res,
    Param,
    Body,
    Query,
    UseGuards,
} from '@nestjs/common';
import * as express from 'express';
import { AuthenticatedGuard } from '../auth/guards/authenticated.guard.js';
import { ProductService } from './product.service.js';
import { CategoryService } from '../category/category.service.js';

@Controller('products')
export class ProductController {
    constructor(
        private productService: ProductService,
        private categoryService: CategoryService,
    ) { }

    // Halaman daftar produk
    @Get()
    async list(
        @Query('search') search: string,
        @Req() req: express.Request,
        @Res() res: express.Response,
    ) {
        if (!req.isAuthenticated()) return res.redirect('/login');

        const products = await this.productService.findAll(search);
        return res.render('products/list', {
            title: 'Daftar Produk',
            products,
            search,
            user: req.user,
            success: req.query.success || null,
        });
    }

    // Halaman form tambah produk
    @Get('create')
    async createForm(@Req() req: express.Request, @Res() res: express.Response) {
        if (!req.isAuthenticated()) return res.redirect('/login');

        const categories = await this.categoryService.findAll();
        return res.render('products/form', {
            title: 'Tambah Produk',
            product: null,
            categories,
            user: req.user,
            errors: null,
        });
    }

    // Simpan produk baru
    @Post()
    async create(
        @Body() body: any,
        @Req() req: express.Request,
        @Res() res: express.Response,
    ) {
        if (!req.isAuthenticated()) return res.redirect('/login');

        // Validasi sederhana
        const errors: string[] = [];
        if (!body.name || body.name.trim() === '') errors.push('Nama produk harus diisi');
        if (!body.price || Number(body.price) <= 0) errors.push('Harga harus lebih dari 0');
        if (!body.categoryId) errors.push('Kategori harus dipilih');

        if (errors.length > 0) {
            const categories = await this.categoryService.findAll();
            return res.render('products/form', {
                title: 'Tambah Produk',
                product: body,
                categories,
                user: req.user,
                errors,
            });
        }

        await this.productService.create({
            name: body.name,
            description: body.description,
            price: Number(body.price),
            stock: Number(body.stock) || 0,
            categoryId: Number(body.categoryId),
        });
        return res.redirect('/products?success=Produk berhasil ditambahkan');
    }

    // Halaman detail produk
    @Get(':id')
    async detail(
        @Param('id') id: string,
        @Req() req: express.Request,
        @Res() res: express.Response,
    ) {
        if (!req.isAuthenticated()) return res.redirect('/login');

        const product = await this.productService.findOne(Number(id));
        if (!product) {
            return res.redirect('/products');
        }
        return res.render('products/detail', {
            title: 'Detail Produk',
            product,
            user: req.user,
        });
    }

    // Halaman form edit produk
    @Get(':id/edit')
    async editForm(
        @Param('id') id: string,
        @Req() req: express.Request,
        @Res() res: express.Response,
    ) {
        if (!req.isAuthenticated()) return res.redirect('/login');

        const product = await this.productService.findOne(Number(id));
        if (!product) {
            return res.redirect('/products');
        }
        const categories = await this.categoryService.findAll();
        return res.render('products/form', {
            title: 'Edit Produk',
            product,
            categories,
            user: req.user,
            errors: null,
        });
    }

    // Update produk
    @Post(':id')
    async update(
        @Param('id') id: string,
        @Body() body: any,
        @Req() req: express.Request,
        @Res() res: express.Response,
    ) {
        if (!req.isAuthenticated()) return res.redirect('/login');

        const errors: string[] = [];
        if (!body.name || body.name.trim() === '') errors.push('Nama produk harus diisi');
        if (!body.price || Number(body.price) <= 0) errors.push('Harga harus lebih dari 0');

        if (errors.length > 0) {
            const categories = await this.categoryService.findAll();
            const product = await this.productService.findOne(Number(id));
            return res.render('products/form', {
                title: 'Edit Produk',
                product: { ...product, ...body },
                categories,
                user: req.user,
                errors,
            });
        }

        await this.productService.update(Number(id), {
            name: body.name,
            description: body.description,
            price: Number(body.price),
            stock: Number(body.stock) || 0,
            categoryId: Number(body.categoryId),
        });
        return res.redirect('/products?success=Produk berhasil diupdate');
    }

    // Hapus produk
    @Post(':id/delete')
    async remove(@Param('id') id: string, @Req() req: express.Request, @Res() res: express.Response) {
        if (!req.isAuthenticated()) return res.redirect('/login');

        await this.productService.remove(Number(id));
        return res.redirect('/products?success=Produk berhasil dihapus');
    }
}
