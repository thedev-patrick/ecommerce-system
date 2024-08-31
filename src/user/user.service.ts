import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User> {
    return this.userRepository.findOneBy({ email });
  }

  async create(user: Partial<User>): Promise<User> {
    return this.userRepository.save(user);
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
