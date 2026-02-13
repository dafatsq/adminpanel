import {
  Controller,
  Get,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import * as express from 'express';
import { AuthenticatedGuard } from './auth/guards/authenticated.guard';
import { CategoryService } from './category/category.service';
import { ProductService } from './product/product.service';

@Controller()
@UseGuards(AuthenticatedGuard)
export class AppController {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly productService: ProductService,
  ) { }

  @Get()
  async dashboard(@Req() req: express.Request, @Res() res: express.Response) {
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
