import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  private readonly adminEmail: string;
  private readonly adminPassword: string;
  private readonly saltRounds: number;

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private configService: ConfigService,
  ) {
    this.adminEmail = this.configService.get<string>('ADMIN_EMAIL');
    this.adminPassword = this.configService.get<string>('ADMIN_PASSWORD');
    this.saltRounds =
      Number(this.configService.get<number>('BCRYPT_SALT_ROUNDS')) || 10;
    this.seedAdmin();
  }

  async findByEmail(email: string): Promise<User> {
    try {
      return await this.userRepository.findOneBy({ email });
    } catch (error) {
      this.logger.error(`Failed to find user by email: ${email}`, error.stack);
      throw new InternalServerErrorException('Error finding user by email.');
    }
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      createUserDto.password = await bcrypt.hash(
        createUserDto.password,
        this.saltRounds,
      );
      const user = this.userRepository.create(createUserDto);
      this.logger.log(`Creating user: ${createUserDto.email}`);
      return await this.userRepository.save(user);
    } catch (error) {
      this.logger.error(
        `Failed to create user: ${createUserDto.email}`,
        error.stack,
      );
      throw new InternalServerErrorException('Error creating user.');
    }
  }

  async findAll(): Promise<User[]> {
    try {
      return await this.userRepository.find();
    } catch (error) {
      this.logger.error('Failed to fetch users', error.stack);
      throw new InternalServerErrorException('Error fetching users.');
    }
  }

  async banUser(id: number): Promise<void> {
    try {
      await this.userRepository.update(id, { isBanned: true });
      this.logger.log(`User with id ${id} has been banned.`);
    } catch (error) {
      this.logger.error(`Failed to ban user with id ${id}`, error.stack);
      throw new InternalServerErrorException('Error banning user.');
    }
  }

  async unbanUser(id: number): Promise<void> {
    try {
      await this.userRepository.update(id, { isBanned: false });
      this.logger.log(`User with id ${id} has been unbanned.`);
    } catch (error) {
      this.logger.error(`Failed to unban user with id ${id}`, error.stack);
      throw new InternalServerErrorException('Error unbanning user.');
    }
  }

  async seedAdmin(): Promise<void> {
    const existingAdmin = await this.findByEmail(this.adminEmail);
    if (existingAdmin) {
      this.logger.log('Admin user already exists.');
      return;
    }

    const hashedPassword = await bcrypt.hash(
      this.adminPassword,
      this.saltRounds,
    );
    const adminUser = this.userRepository.create({
      email: this.adminEmail,
      password: hashedPassword,
      name: 'Admin User',
      role: 'admin',
    });

    try {
      await this.userRepository.save(adminUser);
      this.logger.log('Admin user seeded successfully.');
    } catch (error) {
      this.logger.error('Failed to seed admin user', error.stack);
      throw new InternalServerErrorException('Error seeding admin user.');
    }
  }
}
