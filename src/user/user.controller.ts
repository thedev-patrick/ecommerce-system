import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() body) {
    return this.userService.create(body);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  async findAll() {
    return this.userService.findAll();
  }

  @Post('ban/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  async banUser(@Param('id') id: number) {
    return this.userService.banUser(id);
  }

  @Post('unban/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  async unbanUser(@Param('id') id: number) {
    return this.userService.unbanUser(id);
  }
}
