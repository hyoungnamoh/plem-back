import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/Users';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(Users) private userRepository: Repository<Users>,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'nickname', 'password', 'isCertified', 'enabled'],
    });
    if (!user) {
      return null;
    }

    const result = await bcrypt.compare(password, user.password);
    if (result) {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    return null;
  }

  async login(user: Users) {
    const payload = {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      isCertified: user.isCertified,
      enabled: user.enabled,
    };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
