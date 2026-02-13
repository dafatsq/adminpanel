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
import { CategoryService } from './category.service.js';

@Controller('categories')
export class CategoryController {
    constructor(private categoryService: CategoryService) { }

    // Halaman daftar kategori
    @Get()
    async list(
        @Query('search') search: string,
        @Req() req: express.Request,
        @Res() res: express.Response,
    ) {
        if (!req.isAuthenticated()) return res.redirect('/login');

        const categories = await this.categoryService.findAll(search);
        return res.render('categories/list', {
            title: 'Daftar Kategori',
            categories,
            search,
            user: req.user,
            success: req.query.success || null,
        });
    }

    // Halaman form tambah kategori
    @Get('create')
    createForm(@Req() req: express.Request, @Res() res: express.Response) {
        if (!req.isAuthenticated()) return res.redirect('/login');

        return res.render('categories/form', {
            title: 'Tambah Kategori',
            category: null,
            user: req.user,
            errors: null,
        });
    }

    // Simpan kategori baru
    @Post()
    async create(
        @Body() body: any,
        @Req() req: express.Request,
        @Res() res: express.Response,
    ) {
        if (!req.isAuthenticated()) return res.redirect('/login');

        // Validasi sederhana
        if (!body.name || body.name.trim() === '') {
            return res.render('categories/form', {
                title: 'Tambah Kategori',
                category: body,
                user: req.user,
                errors: ['Nama kategori harus diisi'],
            });
        }

        await this.categoryService.create({
            name: body.name,
            description: body.description,
        });
        return res.redirect('/categories?success=Kategori berhasil ditambahkan');
    }

    // Halaman detail kategori
    @Get(':id')
    async detail(
        @Param('id') id: string,
        @Req() req: express.Request,
        @Res() res: express.Response,
    ) {
        if (!req.isAuthenticated()) return res.redirect('/login');

        const category = await this.categoryService.findOne(Number(id));
        if (!category) {
            return res.redirect('/categories');
        }
        return res.render('categories/detail', {
            title: 'Detail Kategori',
            category,
            user: req.user,
        });
    }

    // Halaman form edit kategori
    @Get(':id/edit')
    async editForm(
        @Param('id') id: string,
        @Req() req: express.Request,
        @Res() res: express.Response,
    ) {
        if (!req.isAuthenticated()) return res.redirect('/login');

        const category = await this.categoryService.findOne(Number(id));
        if (!category) {
            return res.redirect('/categories');
        }
        return res.render('categories/form', {
            title: 'Edit Kategori',
            category,
            user: req.user,
            errors: null,
        });
    }

    // Update kategori
    @Post(':id')
    async update(
        @Param('id') id: string,
        @Body() body: any,
        @Req() req: express.Request,
        @Res() res: express.Response,
    ) {
        if (!body.name || body.name.trim() === '') {
            const category = await this.categoryService.findOne(Number(id));
            return res.render('categories/form', {
                title: 'Edit Kategori',
                category: { ...category, ...body },
                user: req.user,
                errors: ['Nama kategori harus diisi'],
            });
        }

        await this.categoryService.update(Number(id), {
            name: body.name,
            description: body.description,
        });
        return res.redirect('/categories?success=Kategori berhasil diupdate');
    }

    // Hapus kategori
    @Post(':id/delete')
    async remove(@Param('id') id: string, @Req() req: express.Request, @Res() res: express.Response) {
        if (!req.isAuthenticated()) return res.redirect('/login');

        await this.categoryService.remove(Number(id));
        return res.redirect('/categories?success=Kategori berhasil dihapus');
    }
}
