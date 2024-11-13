import * as jwt from 'jsonwebtoken';
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  
  constructor(private readonly configService: ConfigService) {
    console.log('JwtAuthGuard initialized');
  }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Token not provided.');
    }

    // Retrieve the secret from environment variables
    const secret = this.configService.get<string>('JWT_SECRET');

    // Check if the secret is defined, otherwise throw an error
    if (!secret) {
      throw new Error('JWT_SECRET is not defined in the environment variables.');
    }

    try {
      // Verify the token with the secret
      const decoded = jwt.verify(token, secret);
      request.user = decoded;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token.');
    }
  }
}
