import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  price: number;

  @Column({ default: false })
  isApproved: boolean;

  @ManyToOne(() => User, (user) => user.products)
  user: User;
}
