import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import * as express from 'express';
import { AuthenticatedGuard } from './auth/guards/authenticated.guard.js';
import { CategoryService } from './category/category.service.js';
import { ProductService } from './product/product.service.js';

@Controller()
export class AppController {
  constructor(
    private categoryService: CategoryService,
    private productService: ProductService,
  ) { }

  // Halaman dashboard
  @Get()
  async dashboard(@Req() req: express.Request, @Res() res: express.Response) {
    // Check login manual biar bisa redirect kalau belum login
    if (!req.isAuthenticated()) {
      return res.redirect('/login');
    }

    const totalCategories = await this.categoryService.count();
    const totalProducts = await this.productService.count();
    const recentProducts = (await this.productService.findAll()).slice(0, 5);

    return res.render('dashboard', {
      title: 'Dashboard',
      user: req.user,
      totalCategories,
      totalProducts,
      recentProducts,
    });
  }
}
