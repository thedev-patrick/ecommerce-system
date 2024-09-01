import {
  Injectable,
  Logger,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { User } from '../user/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);
  private readonly saltRounds: number;

  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private configService: ConfigService, // Inject ConfigService for environment variables
  ) {
    this.saltRounds =
      this.configService.get<number>('BCRYPT_SALT_ROUNDS') || 10;
  }

  async create(productData: Partial<Product>, user: User): Promise<Product> {
    try {
      const product = this.productRepository.create({ ...productData, user });
      this.logger.log(
        `Creating product: ${product.name} by user ${user.email}`,
      );
      return await this.productRepository.save(product);
    } catch (error) {
      this.logger.error(`Failed to create product`, error.stack);
      throw new InternalServerErrorException('Error creating product.');
    }
  }

  async update(
    id: number,
    productData: Partial<Product>,
    user: User,
  ): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id, user },
    });
    if (!product) {
      throw new NotFoundException(
        'Product not found or you do not have permission to update this product.',
      );
    }
    Object.assign(product, productData);
    return this.productRepository.save(product);
  }

  async delete(id: number, user: User): Promise<void> {
    const product = await this.productRepository.findOne({
      where: { id, user },
    });
    if (!product) {
      throw new NotFoundException(
        'Product not found or you do not have permission to delete this product.',
      );
    }
    await this.productRepository.remove(product);
    this.logger.log(`Deleted product with id ${id} by user ${user.email}`);
  }

  async findAllApproved(): Promise<Product[]> {
    try {
      return await this.productRepository.find({ where: { isApproved: true } });
    } catch (error) {
      this.logger.error('Failed to fetch approved products', error.stack);
      throw new InternalServerErrorException(
        'Error fetching approved products.',
      );
    }
  }
  async findAll(): Promise<Product[]> {
    try {
      return await this.productRepository.find();
    } catch (error) {
      this.logger.error('Failed to fetch all products', error.stack);
      throw new InternalServerErrorException('Error fetching products.');
    }
  }
  async findByUser(user: User): Promise<Product[]> {
    return await this.productRepository.find({ where: { user } });
  }

  async approveProduct(id: number): Promise<void> {
    await this.productRepository.update(id, { isApproved: true });
    this.logger.log(`Product with id ${id} approved`);
  }

  async disapproveProduct(id: number): Promise<void> {
    await this.productRepository.update(id, { isApproved: false });
    this.logger.log(`Product with id ${id} disapproved`);
  }
}
