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
import { ProductService } from './product.service';
import { CategoryService } from '../category/category.service';
import { CreateProductDto } from './dto/create-product.dto';
import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Controller('products')
@UseGuards(AuthenticatedGuard)
export class ProductController {
    constructor(
        private readonly productService: ProductService,
        private readonly categoryService: CategoryService,
    ) { }

    @Get()
    async list(
        @Query('search') search: string,
        @Req() req: express.Request,
        @Res() res: express.Response,
    ) {
        const products = await this.productService.findAll(search);
        return res.render('products/list', {
            title: 'Daftar Produk',
            products,
            search: search || '',
            user: req.user,
            success: req.query.success || null,
        });
    }

    @Get('create')
    async createForm(@Req() req: express.Request, @Res() res: express.Response) {
        const categories = await this.categoryService.findAll();
        return res.render('products/form', {
            title: 'Tambah Produk',
            product: null,
            categories,
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
        const dto = plainToInstance(CreateProductDto, body);
        const errors = await validate(dto);

        if (errors.length > 0) {
            const errorMessages = errors.map((e) =>
                Object.values(e.constraints || {}).join(', '),
            );
            const categories = await this.categoryService.findAll();
            return res.render('products/form', {
                title: 'Tambah Produk',
                product: body,
                categories,
                errors: errorMessages,
                user: req.user,
            });
        }

        await this.productService.create(dto);
        return res.redirect('/products?success=Produk berhasil ditambahkan');
    }

    @Get(':id')
    async detail(
        @Param('id', ParseIntPipe) id: number,
        @Req() req: express.Request,
        @Res() res: express.Response,
    ) {
        const product = await this.productService.findOne(id);
        if (!product) {
            throw new HttpException('Produk tidak ditemukan', HttpStatus.NOT_FOUND);
        }
        return res.render('products/detail', {
            title: `Produk: ${product.name}`,
            product,
            user: req.user,
        });
    }

    @Get(':id/edit')
    async editForm(
        @Param('id', ParseIntPipe) id: number,
        @Req() req: express.Request,
        @Res() res: express.Response,
    ) {
        const product = await this.productService.findOne(id);
        if (!product) {
            throw new HttpException('Produk tidak ditemukan', HttpStatus.NOT_FOUND);
        }
        const categories = await this.categoryService.findAll();
        return res.render('products/form', {
            title: 'Edit Produk',
            product,
            categories,
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
        const dto = plainToInstance(CreateProductDto, body);
        const errors = await validate(dto);

        if (errors.length > 0) {
            const errorMessages = errors.map((e) =>
                Object.values(e.constraints || {}).join(', '),
            );
            const categories = await this.categoryService.findAll();
            return res.render('products/form', {
                title: 'Edit Produk',
                product: { ...body, id },
                categories,
                errors: errorMessages,
                user: req.user,
            });
        }

        const existing = await this.productService.findOne(id);
        if (!existing) {
            throw new HttpException('Produk tidak ditemukan', HttpStatus.NOT_FOUND);
        }

        await this.productService.update(id, dto);
        return res.redirect('/products?success=Produk berhasil diperbarui');
    }

    @Post(':id/delete')
    async remove(
        @Param('id', ParseIntPipe) id: number,
        @Res() res: express.Response,
    ) {
        const existing = await this.productService.findOne(id);
        if (!existing) {
            throw new HttpException('Produk tidak ditemukan', HttpStatus.NOT_FOUND);
        }
        await this.productService.remove(id);
        return res.redirect('/products?success=Produk berhasil dihapus');
    }
}
