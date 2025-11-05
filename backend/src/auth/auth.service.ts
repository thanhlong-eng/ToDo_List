import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  // ---- Đăng ký ----
  async register(username: string, password: string): Promise<User> {
    // Kiểm tra username đã tồn tại
    const existing = await this.userRepository.findOne({ where: { username } });
    if (existing) {
      throw new BadRequestException('Username đã tồn tại');
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({ username, password: hashed });
    return await this.userRepository.save(user);
  }

  // ---- Validate user khi login ----
  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) return null;
    const isMatch = await bcrypt.compare(password, user.password);
    return isMatch ? user : null;
  }

  // ---- Login + tạo JWT ----
  async login(user: User): Promise<{ access_token: string }> {
    const payload = { username: user.username, sub: user.id };
    const access_token = this.jwtService.sign(payload);
    return { access_token };
  }

  // ---- Lấy user từ JWT payload (nếu cần) ----
  async getUserFromPayload(payload: any): Promise<User | null> {
    return this.userRepository.findOne({ where: { id: payload.sub } });
  }
}
