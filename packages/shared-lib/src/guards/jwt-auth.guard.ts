import { OAuth2Client } from 'google-auth-library';

import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(JwtAuthGuard.name);
  private googleClient: OAuth2Client;

  constructor(private readonly configService: ConfigService) {
    const clientId = this.configService.get<string>('GCLOUD_CLIENT_ID');
    if (!clientId) {
      throw new Error('GCLOUD_CLIENT_ID is not defined in environment variables.');
    }

    this.googleClient = new OAuth2Client(clientId);
    this.logger.log('Google OAuth2 Client initialized in GoogleAuthGuard');
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      this.logger.warn('Authorization header not found');
      throw new UnauthorizedException('Authorization header not provided.');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      this.logger.warn('Bearer token not found in authorization header');
      throw new UnauthorizedException('Google ID token not provided.');
    }

    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken: token,
        audience: this.configService.get<string>('GCLOUD_CLIENT_ID'),
      });

      const payload = ticket.getPayload();
      if (!payload) {
        this.logger.warn('Google ID token payload is missing');
        throw new UnauthorizedException('Invalid Google ID token.');
      }

      this.logger.debug(`Google ID token successfully verified for user: ${payload.email}`);
      // Attach user information to the request object
      request.user = {
        id: payload.sub, // Google user ID
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
      };

      return true; // Allow access
    } catch (error) {
      this.logger.error('Failed to validate Google ID token', error);
      throw new UnauthorizedException('Invalid or expired Google ID token.');
    }
  }
}
