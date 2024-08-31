import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from 'typeorm';
import * as bcrypt from 'bcryptjs';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;
  @Column()
  password: string;

  @Column({ default: 'user' })
  role: string;

  @Column({ default: false })
  isBanned: boolean;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
