import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private configService: ConfigService
  ){}

  async register(username: string, email: string, password: string): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: [{ email }, { username }],
    });
  
    if (existingUser) {
      throw new ConflictException('Email or username already exists.');
    }
  
    // Get the number of salt rounds from the environment variable, with a default of 10
    const saltRounds = parseInt(this.configService.get<string>('BCRYPT_SALT_ROUNDS', '10'), 10);
  
    if (isNaN(saltRounds) || saltRounds <= 0) {
      throw new Error('Invalid salt rounds configuration.');
    }
  
    // Hash the password with the specified salt rounds
    const hashedPassword = await bcrypt.hash(password, saltRounds);
  
    const newUser = this.userRepository.create({
      username,
      email,
      password: hashedPassword,
      roles: ['USER'],
    });
  
    return this.userRepository.save(newUser);
  }
  
  async login(email: string, password: string): Promise<{ token: string }> {
    // Find the user by email
    const user = await this.userRepository.findOne({ where: { email } });

    // Validate the user and password
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    // Get JWT_SECRET and JWT_EXPIRES_IN from environment variables
    const jwtSecret = this.configService.get<string>('JWT_SECRET');
    const jwtExpiresIn = this.configService.get<string>('JWT_EXPIRES_IN', '1h');

    // Generate a JWT token
    const token = jwt.sign(
      { userId: user.id, username: user.username, roles: user.roles },
      jwtSecret,
      { expiresIn: jwtExpiresIn },
    );

    return { token };
  }

  async getUserProfile(userId: string): Promise<User> {
    // Fetch user profile by userId
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new UnauthorizedException('User not found.');
    }

    return user;
  }
}
