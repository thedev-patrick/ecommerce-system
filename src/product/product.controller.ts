import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  UseGuards,
  Logger,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { ProductService } from './product.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { User } from '../user/user.entity';
import { GetUser } from '../auth/get-user.decorator';

@ApiTags('products')
@Controller('products')
export class ProductController {
  private readonly logger = new Logger(ProductController.name);

  constructor(private readonly productService: ProductService) {}

  @Get('approved')
  @ApiOperation({ summary: 'Get all approved products' })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of approved products',
  })
  async findAllApproved() {
    return this.productService.findAllApproved();
  }

  @Get('my-products')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all products for the authenticated user' })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of products owned by the authenticated user',
  })
  async findMyProducts(@GetUser() user: User) {
    return this.productService.findByUser(user);
  }

  @Get('all')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all products (admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Returns all products, both approved and unapproved',
  })
  async findAll() {
    return this.productService.findAll();
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({
    status: 201,
    description: 'The product has been successfully created.',
  })
  async create(
    @Body() createProductDto: CreateProductDto,
    @GetUser() user: User,
  ) {
    return this.productService.create(createProductDto, user);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a product owned by the authenticated user' })
  @ApiResponse({
    status: 200,
    description: 'The product has been successfully updated.',
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found.',
  })
  async update(
    @Param('id') id: number,
    @Body() updateProductDto: UpdateProductDto,
    @GetUser() user: User,
  ) {
    return this.productService.update(id, updateProductDto, user);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a product owned by the authenticated user' })
  @ApiResponse({
    status: 200,
    description: 'The product has been successfully deleted.',
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found.',
  })
  async delete(@Param('id') id: number, @GetUser() user: User) {
    return this.productService.delete(id, user);
  }

  @Patch(':id/approve')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Approve a product (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'The product has been successfully approved.',
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found.',
  })
  async approveProduct(@Param('id') id: number) {
    return this.productService.approveProduct(id);
  }

  @Patch(':id/disapprove')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Disapprove a product (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'The product has been successfully disapproved.',
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found.',
  })
  async disapproveProduct(@Param('id') id: number) {
    return this.productService.disapproveProduct(id);
  }
}
