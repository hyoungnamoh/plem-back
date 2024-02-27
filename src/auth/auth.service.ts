import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/Users';
import { DataSource, Repository } from 'typeorm';
import bcrypt from 'bcrypt';
import { PushNotifications } from 'src/entities/PushNotifications';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
    private datasource: DataSource
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

  async logout({ userId, phoneToken }: { userId: number; phoneToken: PushNotifications['phoneToken'] }) {
    const queryRunner = this.datasource.createQueryRunner();
    try {
      queryRunner.connect();
      queryRunner.startTransaction();
      await queryRunner.manager.getRepository(Users).update(userId, {
        refreshToken: null,
      });
      await queryRunner.manager
        .getRepository(PushNotifications)
        .createQueryBuilder()
        .delete()
        .where('user_id=:userId and phone_token=:phoneToken', { userId, phoneToken })
        .execute();
      await queryRunner.commitTransaction();
      return true;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
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
