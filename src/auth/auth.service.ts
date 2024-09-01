/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Injectable,
  Logger,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findByEmail(email);

    if (user && (await bcrypt.compare(pass, user.password))) {
      if (user.isBanned) {
        this.logger.warn(`Banned user ${email} attempted to log in.`);
        throw new ForbiddenException(
          'You are banned from accessing this system.',
        );
      }
      this.logger.log(`User ${email} validated successfully.`);
      const { password, ...result } = user;
      return result;
    }
    this.logger.warn(`Failed login attempt for user ${email}.`);
    throw new UnauthorizedException('Invalid credentials.');
  }

  async login(user: any) {
    const payload = { username: user.email, sub: user.id, role: user.role };
    this.logger.log(`User ${user.email} logged in successfully.`);
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signup(userData: any) {
    const user = await this.userService.create(userData);
    this.logger.log(`User ${user.email} registered successfully.`);
    return user;
  }
}
