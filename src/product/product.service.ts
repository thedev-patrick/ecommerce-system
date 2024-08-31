import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async findAllApproved(): Promise<Product[]> {
    return this.productRepository.find({ where: { isApproved: true } });
  }

  async create(product: Partial<Product>): Promise<Product> {
    return this.productRepository.save(product);
  }

  async update(id: number, product: Partial<Product>): Promise<void> {
    await this.productRepository.update(id, product);
  }

  async remove(id: number): Promise<void> {
    await this.productRepository.delete(id);
  }

  async approveProduct(id: number): Promise<void> {
    await this.productRepository.update(id, { isApproved: true });
  }

  async disapproveProduct(id: number): Promise<void> {
    await this.productRepository.update(id, { isApproved: false });
  }
}
