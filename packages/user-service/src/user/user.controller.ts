// user.controller.ts

import { Body, Controller, Get, Param, Post, UseGuards, Headers } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { User } from 'shared-lib';


@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Register a new user
   * @param body - Contains username, email, and password
   */
  @Post('register')
  async register(
    @Body() body: { username: string; email: string; password: string },
  ): Promise<User> {
    const { username, email, password } = body;
    return this.userService.register(username, email, password);
  }

  /**
   * Login user and return a JWT token
   * @param body - Contains email and password
   */
  @Post('login')
  async login(
    @Body() body: { email: string; password: string },
  ): Promise<{ token: string }> {
    const { email, password } = body;
    return this.userService.login(email, password);
  }

  /**
   * Get user profile by user ID
   * @param userId - ID of the user
   */
  @Get('profile/:userId')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Param('userId') userId: string): Promise<User> {
    return this.userService.getUserProfile(userId);
  }
}
