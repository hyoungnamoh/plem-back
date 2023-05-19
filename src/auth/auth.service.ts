import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/Users';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(Users)
    private userRepository: Repository<Users>
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
    const { newAccessToken, newRefreshToken } = await this.getTokens(user);
    await this.updateRefreshToken(user.id, newRefreshToken);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  async logout(userId: number) {
    const result = await this.userRepository.update(userId, {
      refreshToken: null,
    });
    if (result.affected && result.affected < 1) {
      throw new NotFoundException('존재하지 않는 유저입니다.');
    }
    return;
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    await this.userRepository
      .createQueryBuilder('user')
      .update(Users)
      .set({ refreshToken })
      .where('id = :userId', { userId })
      .execute();
  }
  // async login(req: any,response: Reponse) {
  //   const { id, phoneNumber } = req.user;
  //   const { accessToken, refreshToken } = await this.getTokens(
  //     id,
  //   );

  //   // refresh token 갱신
  //   await this.updateRefreshToken(id, refreshToken);

  // response.cookie('jwt', access_token, { httpOnly: true });
  // response.cookie('jwt-refresh', refresh_token, { httpOnly: true });
  //   return {
  // 	ok : true,
  //   };
  // }

  async refreshTokens({ refreshToken, id }: Users) {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('존재하지 않는 유저입니다.');
    }
    if (refreshToken !== user.refreshToken) {
      throw new UnauthorizedException('유효하지 않은 유저입니다.');
    }

    const { newRefreshToken } = await this.getTokens(user);

    await this.updateRefreshToken(user.id, newRefreshToken);
  }

  async getTokens(user: Users) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          id: user.id,
          email: user.email,
          nickname: user.nickname,
          isCertified: user.isCertified,
          enabled: user.enabled,
        },
        {
          secret: process.env.SECRET,
          expiresIn: process.env.ACCESS_EXPIRES_IN,
        }
      ),
      this.jwtService.signAsync(
        {
          id: user.id,
          email: user.email,
          nickname: user.nickname,
          isCertified: user.isCertified,
          enabled: user.enabled,
        },
        {
          secret: process.env.REFRESH_SECRET,
          expiresIn: process.env.REFRESH_EXPIRES_IN,
        }
      ),
    ]);

    return {
      newAccessToken: accessToken,
      newRefreshToken: refreshToken,
    };
  }
}
