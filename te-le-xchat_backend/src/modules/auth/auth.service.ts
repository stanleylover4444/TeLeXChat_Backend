import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { JwtPayload } from './guards/jwt-auth.guard';
import { Logger } from '@nestjs/common';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    this.logger.log(`Registering user with phone number: ${dto.phoneNumber}`);
    const existingUser = await this.userService.findByPhoneNumber(dto.phoneNumber);
    if (existingUser) {
      this.logger.warn(`Phone number already registered: ${dto.phoneNumber}`);
      throw new UnauthorizedException('Phone number already registered');
    }
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.userService.create({
      ...dto,
      password: hashedPassword,
    });
    const { password, ...userInfo } = user;
    this.logger.log(`User registered successfully: ${dto.phoneNumber}`);
    return {
      user: userInfo,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.userService.findByPhoneNumber(dto.phoneNumber);
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      this.logger.warn(`Invalid login attempt for phone number: ${dto.phoneNumber}`);
      throw new UnauthorizedException('Invalid credentials');
    }
    const { password, ...userInfo } = user;
    this.logger.log(`User logged in successfully: ${dto.phoneNumber}`);
    return {
      user: userInfo,
      token: this.generateToken(user),
    };
  }

async getUserFromToken(token: string): Promise<Partial<User> | null> {
  try {
    const payload = this.jwtService.verify(token) as JwtPayload;
    const user = await this.userService.findById(payload.sub);
    if (!user) {
      this.logger.warn(`User not found for token with ID: ${payload.sub}`);
      return null;
    }
    const { password, ...userInfo } = user;
    this.logger.log(`User retrieved from token: ${payload.phoneNumber}`);
    return userInfo;
  } catch (error) {
    this.logger.error(`Token verification failed: ${error.message}`);
    throw new UnauthorizedException('Invalid or expired token');
  }
}

  generateToken(user: User) {
    const payload: JwtPayload = {
      sub: user.id,
      phoneNumber: user.phoneNumber,
      fullName: user.fullName,
      isActive: user.isActive,
    };
    return this.jwtService.sign(payload);
  }
}