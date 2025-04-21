import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private jwtService: JwtService) {}

  async login(user: any) {
    this.logger.log('Logging in user:', user);

    const payload = { email: user.email, name: user.name };
    const token = this.jwtService.sign(payload);

    this.logger.log('Generated JWT:', token);
    return { access_token: token };
  }
}
