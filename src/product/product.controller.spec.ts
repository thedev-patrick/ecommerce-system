import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { User } from '../user/user.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

describe('ProductController', () => {
  let controller: ProductController;
  let service: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: {
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            findAllApproved: jest.fn(),
            approveProduct: jest.fn(),
            disapproveProduct: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useValue({})
      .overrideGuard(RolesGuard)
      .useValue({})
      .compile();

    controller = module.get<ProductController>(ProductController);
    service = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call create on service with CreateProductDto and user', async () => {
      const user = new User();
      user.id = 1;
      const productData: CreateProductDto = {
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
        quantity: 10,
      };

      const createdProduct = {
        id: 1,
        ...productData,
        user,
      };

      jest.spyOn(service, 'create').mockResolvedValue(createdProduct as any);

      const result = await controller.create(productData, user);
      expect(service.create).toHaveBeenCalledWith(productData, user);
      expect(result).toEqual(createdProduct);
    });
  });

  describe('update', () => {
    it('should call update on service with UpdateProductDto, product ID, and user', async () => {
      const user = new User();
      user.id = 1;
      const productData: UpdateProductDto = {
        name: 'Updated Product',
        description: 'Updated Description',
        price: 150,
        quantity: 5,
      };

      const updatedProduct = {
        id: 1,
        ...productData,
        user,
      };

      jest.spyOn(service, 'update').mockResolvedValue(updatedProduct as any);

      const result = await controller.update(1, productData, user);
      expect(service.update).toHaveBeenCalledWith(1, productData, user);
      expect(result).toEqual(updatedProduct);
    });
  });

  describe('delete', () => {
    it('should call delete on service with product ID and user', async () => {
      const user = new User();
      user.id = 1;

      await controller.delete(1, user);
      expect(service.delete).toHaveBeenCalledWith(1, user);
    });
  });

  describe('findAllApproved', () => {
    it('should return all approved products', async () => {
      const approvedProducts = [
        { id: 1, name: 'Approved Product 1', isApproved: true },
        { id: 2, name: 'Approved Product 2', isApproved: true },
      ];

      jest
        .spyOn(service, 'findAllApproved')
        .mockResolvedValue(approvedProducts as any);

      const result = await controller.findAllApproved();
      expect(result).toEqual(approvedProducts);
    });
  });

  describe('approveProduct', () => {
    it('should call approveProduct on service with product ID', async () => {
      await controller.approveProduct(1);
      expect(service.approveProduct).toHaveBeenCalledWith(1);
    });
  });

  describe('disapproveProduct', () => {
    it('should call disapproveProduct on service with product ID', async () => {
      await controller.disapproveProduct(1);
      expect(service.disapproveProduct).toHaveBeenCalledWith(1);
    });
  });
});
