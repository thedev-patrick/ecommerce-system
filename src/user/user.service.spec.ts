import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { User } from './user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { InternalServerErrorException } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      const user = { id: 1, email: 'test@example.com' };

      jest.spyOn(repository, 'findOneBy').mockResolvedValue(user as any);

      const result = await service.findByEmail('test@example.com');
      expect(result).toEqual(user);
      expect(repository.findOneBy).toHaveBeenCalledWith({
        email: 'test@example.com',
      });
    });

    it('should throw InternalServerErrorException if an error occurs', async () => {
      jest
        .spyOn(repository, 'findOneBy')
        .mockRejectedValue(new Error('Database error'));

      await expect(service.findByEmail('test@example.com')).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('create', () => {
    it('should create a user with hashed password', async () => {
      const userData = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123',
      };

      const savedUser = {
        id: 1,
        ...userData,
        password: 'hashedpassword123',
      };

      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedpassword123');
      jest.spyOn(repository, 'create').mockReturnValue(savedUser as any);
      jest.spyOn(repository, 'save').mockResolvedValue(savedUser as any);

      const result = await service.create(userData as any);
      expect(result.password).toEqual('hashedpassword123');
      expect(repository.create).toHaveBeenCalledWith(
        expect.objectContaining(userData),
      );
      expect(repository.save).toHaveBeenCalled();
    });

    it('should throw InternalServerErrorException if creation fails', async () => {
      const userData = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123',
      };

      jest
        .spyOn(repository, 'save')
        .mockRejectedValue(new Error('Database error'));

      await expect(service.create(userData as any)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const users = [
        { id: 1, email: 'user1@example.com' },
        { id: 2, email: 'user2@example.com' },
      ];

      jest.spyOn(repository, 'find').mockResolvedValue(users as any);

      const result = await service.findAll();
      expect(result).toEqual(users);
      expect(repository.find).toHaveBeenCalled();
    });

    it('should throw InternalServerErrorException if fetching users fails', async () => {
      jest
        .spyOn(repository, 'find')
        .mockRejectedValue(new Error('Database error'));

      await expect(service.findAll()).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('banUser', () => {
    it('should ban a user by setting isBanned to true', async () => {
      const userId = 1;

      jest
        .spyOn(repository, 'update')
        .mockResolvedValue({ affected: 1 } as any);

      await service.banUser(userId);
      expect(repository.update).toHaveBeenCalledWith(userId, {
        isBanned: true,
      });
    });

    it('should throw InternalServerErrorException if banning fails', async () => {
      jest
        .spyOn(repository, 'update')
        .mockRejectedValue(new Error('Database error'));

      await expect(service.banUser(1)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('unbanUser', () => {
    it('should unban a user by setting isBanned to false', async () => {
      const userId = 1;

      jest
        .spyOn(repository, 'update')
        .mockResolvedValue({ affected: 1 } as any);

      await service.unbanUser(userId);
      expect(repository.update).toHaveBeenCalledWith(userId, {
        isBanned: false,
      });
    });

    it('should throw InternalServerErrorException if unbanning fails', async () => {
      jest
        .spyOn(repository, 'update')
        .mockRejectedValue(new Error('Database error'));

      await expect(service.unbanUser(1)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('seedAdmin', () => {
    it('should create an admin user if one does not exist', async () => {
      const adminEmail = 'admin@example.com';
      const adminUser = {
        id: 1,
        email: adminEmail,
        password: 'hashedpassword',
        role: 'admin',
        name: 'Admin User',
      };

      jest.spyOn(service, 'findByEmail').mockResolvedValue(null);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedpassword');
      jest.spyOn(repository, 'create').mockReturnValue(adminUser as any);
      jest.spyOn(repository, 'save').mockResolvedValue(adminUser as any);

      await service.seedAdmin();

      expect(service.findByEmail).toHaveBeenCalledWith(adminEmail);
      expect(repository.create).toHaveBeenCalledWith(
        expect.objectContaining({ email: adminEmail }),
      );
      expect(repository.save).toHaveBeenCalledWith(adminUser);
    });

    it('should not create an admin user if one already exists', async () => {
      const adminEmail = 'admin@example.com';
      const existingAdminUser = { id: 1, email: adminEmail, role: 'admin' };

      jest
        .spyOn(service, 'findByEmail')
        .mockResolvedValue(existingAdminUser as any);

      await service.seedAdmin();

      expect(service.findByEmail).toHaveBeenCalledWith(adminEmail);
      expect(repository.create).not.toHaveBeenCalled();
      expect(repository.save).not.toHaveBeenCalled();
    });

    it('should throw InternalServerErrorException if admin seeding fails', async () => {
      jest.spyOn(service, 'findByEmail').mockResolvedValue(null);
      jest
        .spyOn(repository, 'save')
        .mockRejectedValue(new Error('Database error'));

      await expect(service.seedAdmin()).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
