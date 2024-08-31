import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User> {
    return this.userRepository.findOneBy({ email });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  async seedAdmin() {
    const adminExists = await this.userRepository.findOne({
      where: { role: 'admin' },
    });
    if (!adminExists) {
      const adminUser = new CreateUserDto();
      adminUser.email = 'admin@example.com';
      adminUser.name = 'Admin User';
      adminUser.password = 'adminpassword';
      adminUser.role = 'admin';
      await this.create(adminUser);
      console.log('Admin user seeded.');
    } else {
      console.log('Admin user already exists.');
    }
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async banUser(id: number): Promise<void> {
    await this.userRepository.update(id, { isBanned: true });
  }

  async unbanUser(id: number): Promise<void> {
    await this.userRepository.update(id, { isBanned: false });
  }
}
