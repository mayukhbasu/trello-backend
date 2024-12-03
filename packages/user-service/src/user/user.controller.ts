import { Controller, Get, Post, Headers, Param, UnauthorizedException, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { JwtAuthGuard } from 'shared-lib';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Authenticate or register a user with Google SSO
   * @param authorization - Authorization header containing Google ID token
   */
  @Post('google-auth')
  async authenticateWithGoogle(
    @Headers('Authorization') authorization: string,
  ): Promise<User> {
    if (!authorization) {
      throw new UnauthorizedException('Authorization header is missing.');
    }

    const idToken = authorization.replace('Bearer ', '');
    return this.userService.authenticateWithGoogle(idToken);
  }

  /**
   * Get user profile by user ID
   * @param userId - User ID
   */
  @Get('profile/:userId')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Param('userId') userId: string): Promise<User> {
    return this.userService.getUserProfile(userId);
  }
}
