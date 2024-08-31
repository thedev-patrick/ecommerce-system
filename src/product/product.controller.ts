import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('approved')
  async findAllApproved() {
    return this.productService.findAllApproved();
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() body) {
    return this.productService.create(body);
  }

  @Post('approve/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  async approveProduct(@Param('id') id: number) {
    return this.productService.approveProduct(id);
  }

  @Post('disapprove/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  async disapproveProduct(@Param('id') id: number) {
    return this.productService.disapproveProduct(id);
  }
}
