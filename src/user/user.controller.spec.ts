import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { RolesGuard } from '../auth/roles.guard';
import { AuthGuard } from '@nestjs/passport';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            findAll: jest.fn(),
            banUser: jest.fn(),
            unbanUser: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useValue({})
      .overrideGuard(RolesGuard)
      .useValue({})
      .compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should call findAll on service when getting all users', async () => {
      const users = [
        { id: 1, email: 'user1@example.com' },
        { id: 2, email: 'user2@example.com' },
      ];

      jest.spyOn(service, 'findAll').mockResolvedValue(users as any);

      const result = await controller.findAll();
      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(users);
    });
  });

  describe('banUser', () => {
    it('should call banUser on service with user ID', async () => {
      const userId = 1;

      await controller.banUser(userId);
      expect(service.banUser).toHaveBeenCalledWith(userId);
    });
  });

  describe('unbanUser', () => {
    it('should call unbanUser on service with user ID', async () => {
      const userId = 1;

      await controller.unbanUser(userId);
      expect(service.unbanUser).toHaveBeenCalledWith(userId);
    });
  });
});
