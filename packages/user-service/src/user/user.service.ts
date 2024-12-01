import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  private googleClient: OAuth2Client;

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    // Initialize OAuth2 Client with Client ID and Secret
    this.googleClient = new OAuth2Client(
      process.env.GCLOUD_CLIENT_ID,
      process.env.GCLOUD_CLIENT_SECRET,
      process.env.GCLOUD_REDIRECT_URI,
    );
  }

  /**
   * Verify Google ID token and get user information
   * @param idToken - Google OAuth2 ID token
   * @returns User details from Google
   */
  async verifyGoogleToken(idToken: string): Promise<any> {
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken,
        audience: process.env.GCLOUD_CLIENT_ID, // Ensure this matches your Google Cloud Client ID
      });
      const payload = ticket.getPayload();
      if (!payload) {
        throw new UnauthorizedException('Invalid Google ID token.');
      }
      return payload;
    } catch (error) {
      throw new UnauthorizedException('Failed to validate Google ID token.');
    }
  }

  /**
   * Authenticate or register a user using Google SSO
   * @param idToken - Google OAuth2 ID token
   * @returns User entity
   */
  async authenticateWithGoogle(idToken: string): Promise<User> {
    const googleUser = await this.verifyGoogleToken(idToken);

    const { email, name, sub } = googleUser; // `sub` is the Google user ID

    // Check if user exists in the database
    let user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      // Register the user if they don't exist
      user = this.userRepository.create({
        username: name || email.split('@')[0],
        email,
        password: sub, // Placeholder for Google User ID; password is irrelevant for SSO
        roles: ['USER'],
      });
      user = await this.userRepository.save(user);
    }

    return user;
  }

  async getUserProfile(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }

    return user;
  }
}
