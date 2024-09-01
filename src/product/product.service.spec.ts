import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { Product } from './product.entity';
import { User } from '../user/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';

describe('ProductService', () => {
  let service: ProductService;
  let repository: Repository<Product>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(Product),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    repository = module.get<Repository<Product>>(getRepositoryToken(Product));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a product for a user', async () => {
      const user = new User();
      user.id = 1;
      const productData = {
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
        quantity: 10,
      };

      jest.spyOn(repository, 'create').mockReturnValue(productData as any);
      jest.spyOn(repository, 'save').mockResolvedValue(productData as any);

      const result = await service.create(productData as any, user);
      expect(result.name).toEqual('Test Product');
      expect(repository.create).toHaveBeenCalledWith(
        expect.objectContaining(productData),
      );
      expect(repository.save).toHaveBeenCalled();
    });

    it('should throw InternalServerErrorException if creation fails', async () => {
      const user = new User();
      user.id = 1;
      const productData = {
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
        quantity: 10,
      };

      jest
        .spyOn(repository, 'save')
        .mockRejectedValue(new Error('Database error'));

      await expect(service.create(productData as any, user)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('update', () => {
    it('should update a product owned by the user', async () => {
      const user = new User();
      user.id = 1;
      const productData = {
        name: 'Updated Product',
        description: 'Updated Description',
        price: 150,
        quantity: 5,
      };

      const existingProduct = {
        id: 1,
        ...productData,
        user,
      };

      jest
        .spyOn(repository, 'findOne')
        .mockResolvedValue(existingProduct as any);
      jest.spyOn(repository, 'save').mockResolvedValue(existingProduct as any);

      const result = await service.update(1, productData as any, user);
      expect(result.name).toEqual('Updated Product');
      expect(repository.save).toHaveBeenCalledWith(
        expect.objectContaining(productData),
      );
    });

    it('should throw NotFoundException if product does not exist or not owned by user', async () => {
      const user = new User();
      user.id = 1;
      const productData = {
        name: 'Updated Product',
        description: 'Updated Description',
        price: 150,
        quantity: 5,
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.update(1, productData as any, user)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('delete', () => {
    it('should delete a product owned by the user', async () => {
      const user = new User();
      user.id = 1;

      const existingProduct = {
        id: 1,
        name: 'Test Product',
        user,
      };

      jest
        .spyOn(repository, 'findOne')
        .mockResolvedValue(existingProduct as any);
      jest
        .spyOn(repository, 'remove')
        .mockResolvedValue(existingProduct as any);

      await service.delete(1, user);
      expect(repository.remove).toHaveBeenCalledWith(existingProduct);
    });

    it('should throw NotFoundException if product does not exist or not owned by user', async () => {
      const user = new User();
      user.id = 1;

      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.delete(1, user)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAllApproved', () => {
    it('should return all approved products', async () => {
      const approvedProducts = [
        { id: 1, name: 'Approved Product 1', isApproved: true },
        { id: 2, name: 'Approved Product 2', isApproved: true },
      ];

      jest.spyOn(repository, 'find').mockResolvedValue(approvedProducts as any);

      const result = await service.findAllApproved();
      expect(result).toEqual(approvedProducts);
      expect(repository.find).toHaveBeenCalledWith({
        where: { isApproved: true },
      });
    });

    it('should throw InternalServerErrorException if fetching fails', async () => {
      jest
        .spyOn(repository, 'find')
        .mockRejectedValue(new Error('Database error'));

      await expect(service.findAllApproved()).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('approveProduct', () => {
    it('should approve a product', async () => {
      jest
        .spyOn(repository, 'update')
        .mockResolvedValue({ affected: 1 } as any);

      await service.approveProduct(1);
      expect(repository.update).toHaveBeenCalledWith(1, { isApproved: true });
    });

    it('should throw InternalServerErrorException if approval fails', async () => {
      jest
        .spyOn(repository, 'update')
        .mockRejectedValue(new Error('Database error'));

      await expect(service.approveProduct(1)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
  describe('findAll', () => {
    it('should return all products, both approved and unapproved', async () => {
      const products = [
        { id: 1, name: 'Product 1', isApproved: true },
        { id: 2, name: 'Product 2', isApproved: false },
      ];

      jest.spyOn(repository, 'find').mockResolvedValue(products as any);

      const result = await service.findAll();
      expect(result).toEqual(products);
      expect(repository.find).toHaveBeenCalled();
    });

    it('should throw InternalServerErrorException if fetching all products fails', async () => {
      jest
        .spyOn(repository, 'find')
        .mockRejectedValue(new Error('Database error'));

      await expect(service.findAll()).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
  describe('disapproveProduct', () => {
    it('should disapprove a product', async () => {
      jest
        .spyOn(repository, 'update')
        .mockResolvedValue({ affected: 1 } as any);

      await service.disapproveProduct(1);
      expect(repository.update).toHaveBeenCalledWith(1, { isApproved: false });
    });

    it('should throw InternalServerErrorException if disapproval fails', async () => {
      jest
        .spyOn(repository, 'update')
        .mockRejectedValue(new Error('Database error'));

      await expect(service.disapproveProduct(1)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
