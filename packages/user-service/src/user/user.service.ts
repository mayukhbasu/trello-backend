import { Injectable, NotFoundException, UnauthorizedException, Logger } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  private googleClient: OAuth2Client;

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    // Initialize Google OAuth2 Client
    this.googleClient = new OAuth2Client(process.env.GCLOUD_CLIENT_ID, process.env.GCLOUD_CLIENT_SECRET);
    this.logger.log('Google OAuth2 Client initialized');
  }

  /**
   * Verify Google ID token and get user information
   * @param idToken - Google OAuth2 ID token
   * @returns User details from Google
   */
  async verifyGoogleToken(idToken: string): Promise<any> {
    this.logger.debug('Attempting to verify Google ID token');
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken,
        audience: process.env.GCLOUD_CLIENT_ID, // Ensure this matches your Google Client ID
      });
      const payload = ticket.getPayload();
      if (!payload) {
        this.logger.warn('Google ID token is invalid or payload is missing');
        throw new UnauthorizedException('Invalid Google ID token.');
      }
      this.logger.log('Google ID token successfully verified');
      return payload;
    } catch (error) {
      this.logger.error('Failed to validate Google ID token', error.stack);
      throw new UnauthorizedException('Failed to validate Google ID token.');
    }
  }

  /**
   * Authenticate or register a user using Google SSO
   * @param idToken - Google OAuth2 ID token
   * @returns User entity
   */
  async authenticateWithGoogle(idToken: string): Promise<User> {
    this.logger.debug('Authenticating user with Google SSO');
    const googleUser = await this.verifyGoogleToken(idToken);

    const { email, name, sub } = googleUser; // `sub` is the Google user ID
    this.logger.log(`Google user data: email=${email}, name=${name}, sub=${sub}`);

    // Check if user exists in the database
    let user = await this.userRepository.findOne({ where: { email } });
    if (user) {
      this.logger.log(`User found in the database: email=${email}`);
    } else {
      this.logger.log(`User not found, registering new user: email=${email}`);
      // Register the user if they don't exist
      user = this.userRepository.create({
        username: name || email.split('@')[0],
        email,
        password: sub, // Placeholder for Google User ID; password is irrelevant for SSO
        roles: ['USER'],
      });
      user = await this.userRepository.save(user);
      this.logger.log(`User successfully registered: id=${user.id}, email=${user.email}`);
    }

    return user;
  }

  async getUserProfile(userId: string): Promise<User> {
    this.logger.debug(`Fetching user profile for userId=${userId}`);
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      this.logger.warn(`User with ID ${userId} not found`);
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }

    this.logger.log(`User profile fetched successfully: userId=${user.id}`);
    return user;
  }
}
