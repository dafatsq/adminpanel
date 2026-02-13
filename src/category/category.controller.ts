import {
    Controller,
    Get,
    Post,
    Param,
    Body,
    Query,
    Res,
    Req,
    UseGuards,
    ParseIntPipe,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import * as express from 'express';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Controller('categories')
@UseGuards(AuthenticatedGuard)
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) { }

    @Get()
    async list(
        @Query('search') search: string,
        @Req() req: express.Request,
        @Res() res: express.Response,
    ) {
        const categories = await this.categoryService.findAll(search);
        return res.render('categories/list', {
            title: 'Daftar Kategori',
            categories,
            search: search || '',
            user: req.user,
            success: req.query.success || null,
        });
    }

    @Get('create')
    async createForm(@Req() req: express.Request, @Res() res: express.Response) {
        return res.render('categories/form', {
            title: 'Tambah Kategori',
            category: null,
            errors: null,
            user: req.user,
        });
    }

    @Post()
    async create(
        @Body() body: any,
        @Req() req: express.Request,
        @Res() res: express.Response,
    ) {
        const dto = plainToInstance(CreateCategoryDto, body);
        const errors = await validate(dto);

        if (errors.length > 0) {
            const errorMessages = errors.map((e) =>
                Object.values(e.constraints || {}).join(', '),
            );
            return res.render('categories/form', {
                title: 'Tambah Kategori',
                category: body,
                errors: errorMessages,
                user: req.user,
            });
        }

        await this.categoryService.create(dto);
        return res.redirect('/categories?success=Kategori berhasil ditambahkan');
    }

    @Get(':id')
    async detail(
        @Param('id', ParseIntPipe) id: number,
        @Req() req: express.Request,
        @Res() res: express.Response,
    ) {
        const category = await this.categoryService.findOne(id);
        if (!category) {
            throw new HttpException('Kategori tidak ditemukan', HttpStatus.NOT_FOUND);
        }
        return res.render('categories/detail', {
            title: `Kategori: ${category.name}`,
            category,
            user: req.user,
        });
    }

    @Get(':id/edit')
    async editForm(
        @Param('id', ParseIntPipe) id: number,
        @Req() req: express.Request,
        @Res() res: express.Response,
    ) {
        const category = await this.categoryService.findOne(id);
        if (!category) {
            throw new HttpException('Kategori tidak ditemukan', HttpStatus.NOT_FOUND);
        }
        return res.render('categories/form', {
            title: 'Edit Kategori',
            category,
            errors: null,
            user: req.user,
        });
    }

    @Post(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: any,
        @Req() req: express.Request,
        @Res() res: express.Response,
    ) {
        const dto = plainToInstance(CreateCategoryDto, body);
        const errors = await validate(dto);

        if (errors.length > 0) {
            const errorMessages = errors.map((e) =>
                Object.values(e.constraints || {}).join(', '),
            );
            return res.render('categories/form', {
                title: 'Edit Kategori',
                category: { ...body, id },
                errors: errorMessages,
                user: req.user,
            });
        }

        const existing = await this.categoryService.findOne(id);
        if (!existing) {
            throw new HttpException('Kategori tidak ditemukan', HttpStatus.NOT_FOUND);
        }

        await this.categoryService.update(id, dto);
        return res.redirect('/categories?success=Kategori berhasil diperbarui');
    }

    @Post(':id/delete')
    async remove(
        @Param('id', ParseIntPipe) id: number,
        @Res() res: express.Response,
    ) {
        const existing = await this.categoryService.findOne(id);
        if (!existing) {
            throw new HttpException('Kategori tidak ditemukan', HttpStatus.NOT_FOUND);
        }
        await this.categoryService.remove(id);
        return res.redirect('/categories?success=Kategori berhasil dihapus');
    }
}
