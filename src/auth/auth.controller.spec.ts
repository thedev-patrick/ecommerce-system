import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signup: jest.fn(),
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signup', () => {
    it('should call signup on service with CreateUserDto', async () => {
      const dto: CreateUserDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      const savedUser = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        role: 'user',
      };

      jest.spyOn(service, 'signup').mockResolvedValue(savedUser as any);

      const result = await controller.signup(dto);
      expect(service.signup).toHaveBeenCalledWith(dto);
      expect(result).toEqual(savedUser);
    });
  });

  describe('login', () => {
    it('should call login on service with LoginUserDto', async () => {
      const dto: LoginUserDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const token = {
        access_token: 'jwt-token',
      };

      jest.spyOn(service, 'login').mockResolvedValue(token as any);

      const result = await controller.login(dto);
      expect(service.login).toHaveBeenCalledWith(dto);
      expect(result).toEqual(token);
    });
  });
});
