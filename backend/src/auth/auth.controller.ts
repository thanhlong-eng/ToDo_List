import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // ---- Đăng ký user mới ----
  @Post('register')
  async register(@Body() dto: AuthDto) {
    try {
      const user = await this.authService.register(dto.username, dto.password);
      return {
        message: 'User registered successfully',
        id: user.id,
        username: user.username,
      };
    } catch (err) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: err.message || 'Registration failed',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // ---- Đăng nhập ----
  @Post('login')
  async login(@Body() dto: AuthDto, @Res({ passthrough: true }) res: Response) {
    try {
      const user = await this.authService.validateUser(dto.username, dto.password);
      if (!user) {
        throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
      }

      const token = await this.authService.login(user);

      // ---- Trả token qua HTTP-only cookie ----
      res.cookie('jwt', token.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60, // 1 giờ
      });

      return {
        message: 'Login successful',
      };
    } catch (err) {
      throw new HttpException(
        {
          statusCode: err.status || HttpStatus.UNAUTHORIZED,
          message: err.message || 'Login failed',
        },
        err.status || HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
