import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/Users';
import { DataSource, Repository } from 'typeorm';
import { SignUpRequestDto } from './dto/sign-up.request.dto';
import bcrypt from 'bcrypt';
import { ChangeMyInfoRequestDto } from './dto/change-my-info.request.dto';
import { AuthService } from 'src/auth/auth.service';
@Injectable()
export class UsersService {
  // service(business logic)는 repo(이어주는 역할)를 통해 entitiy(table)에 쿼리를 날림
  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
    private datasource: DataSource,
    private authService: AuthService
  ) {}

  async signUp({ email, password, nickname }: SignUpRequestDto) {
    const user = await this.userRepository.findOne({
      where: { email },
      withDeleted: true,
    });
    if (user) {
      throw new HttpException('이미 사용중인 이메일입니다!', 400);
    }
    const hashedPassword = await bcrypt.hash(password, 12);

    await this.userRepository.save({
      email,
      password: hashedPassword,
      nickname,
    });

    return true;
  }

  // 테스트 필요
  async putUser({ email }: Users, { password, nickname, newPassword }: ChangeMyInfoRequestDto) {
    const user = await this.userRepository.findOne({
      where: { email },
      select: ['password'],
    });

    if (!user) {
      throw new UnauthorizedException('존재하지 않는 유저입니다.');
    }

    const isCorrect = await bcrypt.compare(password, user.password);

    if (!isCorrect) {
      throw new BadRequestException('기존 비밀번호가 일치하지 않습니다.');
    }
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    const result = await this.userRepository.update(user.id, {
      password: hashedPassword,
      nickname,
    });

    if (result.affected && result.affected < 1) {
      throw new InternalServerErrorException('정보 수정에 실패했습니다. 잠시후 다시 시도해주세요.');
    }
  }

  async deleteUser({ id, email, password }: Users & { password: string }) {
    const user = await this.userRepository
      .createQueryBuilder()
      .select(['id', 'email', 'password'])
      .where('id = :id and email = :email and removed_at is null', { id, email })
      .getOne();

    if (!user) {
      throw new NotFoundException('존재하지 않는 유저입니다.');
    }

    const result = await bcrypt.compare(password, user.password);

    if (!result) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다');
    }

    await this.userRepository
      .createQueryBuilder('user')
      .softDelete()
      .from(Users)
      .where('id = :id and email = :email', { id, email })
      .execute();

    return {
      id,
    };
  }

  async checkDuplicateEmail({ email }: { email: string }) {
    const user = await this.userRepository.createQueryBuilder('user').where('user.email = :email', { email }).getOne();

    if (user && !user.removedAt) {
      throw new BadRequestException('이미 사용중인 이메일 입니다.');
    }
    return true;
  }

  async getUserFromEmail({ email }: { email: string }) {
    const user = await this.userRepository.createQueryBuilder('user').where('user.email = :email', { email }).getOne();

    return user;
  }

  async updateNickname({ nickname, userId }: { nickname: string; userId: number }) {
    const queryRunner = this.datasource.createQueryRunner();
    try {
      queryRunner.connect();
      queryRunner.startTransaction();
      const user = await this.userRepository.createQueryBuilder('user').where('id = :userId', { userId }).getOne();

      if (!nickname) {
        throw new BadRequestException('닉네임을 입력해주세요.');
      }

      if (!user || user.removedAt) {
        throw new BadRequestException('계정을 찾을 수가 없습니다.');
      }

      if (user.nickname === nickname) {
        throw new BadRequestException('기존 닉네임과 동일합니다.');
      }
      const newNicknameUser = { ...user, nickname };

      const { newAccessToken, newRefreshToken } = await this.authService.getTokens(newNicknameUser);

      await queryRunner.manager
        .getRepository(Users)
        .createQueryBuilder('user')
        .update(Users)
        .set({ nickname, refreshToken: newRefreshToken })
        .where('id = :userId', { userId })
        .execute();

      await queryRunner.commitTransaction();

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        id: userId,
        nickname,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async updatePassword({
    email,
    currentPassword,
    newPassword,
  }: {
    email: string;
    currentPassword: string;
    newPassword: string;
  }) {
    if (!email) {
      throw new BadRequestException('이메일을 입력해 주세요.');
    }
    if (!currentPassword || !newPassword) {
      throw new BadRequestException('비밀번호를 입력해 주세요.');
    }

    const user = await this.userRepository.findOne({
      select: ['id', 'password'],
      where: { email },
    });
    if (!user) {
      throw new NotFoundException('존재하지 않는 이메일입니다.');
    }

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) {
      throw new BadRequestException('현재 비밀번호가 일치하지 않습니다.');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    const result = await this.userRepository.update(user.id, {
      password: hashedPassword,
    });

    if (result.affected && result.affected < 1) {
      throw new InternalServerErrorException('정보 수정에 실패했습니다. 잠시후 다시 시도해주세요.');
    }

    return {
      id: user.id,
    };
  }

  async initPassword({ email, password }: { email: string; password: string }) {
    if (!email) {
      throw new BadRequestException('이메일을 입력해 주세요.');
    }
    if (!password) {
      throw new BadRequestException('비밀번호를 입력해 주세요.');
    }

    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('존재하지 않는 이메일입니다.');
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const result = await this.userRepository.update(user.id, {
      password: hashedPassword,
    });

    if (result.affected && result.affected < 1) {
      throw new InternalServerErrorException('정보 수정에 실패했습니다. 잠시후 다시 시도해주세요.');
    }

    return {
      id: user.id,
    };
  }

  // async updateEmail({ newEmail, originEmail }: { newEmail: string; originEmail: string }) {
  //   if (!newEmail) {
  //     throw new BadRequestException('이메일을 입력해 주세요.');
  //   }

  //   const user = await this.userRepository.findOne({
  //     where: { email: originEmail },
  //   });
  //   if (!user) {
  //     throw new NotFoundException('존재하지 않는 이메일입니다.');
  //   }

  //   const result = await this.userRepository.update(user.id, {
  //     email: newEmail,
  //   });

  //   if (result.affected && result.affected < 1) {
  //     throw new InternalServerErrorException('이메일 변경에 실패했습니다. 잠시후 다시 시도해주세요.');
  //   }

  //   return {
  //     id: user.id,
  //   };
  // }

  async updateEmail({ newEmail, userId }: { newEmail: string; userId: number }) {
    const queryRunner = this.datasource.createQueryRunner();
    try {
      queryRunner.connect();
      queryRunner.startTransaction();
      const user = await this.userRepository.createQueryBuilder('user').where('id = :userId', { userId }).getOne();

      if (!newEmail) {
        throw new BadRequestException('닉네임을 입력해주세요.');
      }

      if (!user || user.removedAt) {
        throw new BadRequestException('계정을 찾을 수가 없습니다.');
      }

      if (user.email === newEmail) {
        throw new BadRequestException('기존 닉네임과 동일합니다.');
      }
      const newEmailUser: Users = { ...user, email: newEmail };

      const { newAccessToken, newRefreshToken } = await this.authService.getTokens(newEmailUser);

      await queryRunner.manager
        .getRepository(Users)
        .createQueryBuilder('user')
        .update(Users)
        .set({ email: newEmail, refreshToken: newRefreshToken })
        .where('id = :userId', { userId })
        .execute();

      await queryRunner.commitTransaction();

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        id: userId,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async updatePlanNotification({ userId, planNotification }: { userId: number; planNotification: boolean }) {
    const queryRunner = this.datasource.createQueryRunner();
    try {
      queryRunner.connect();
      queryRunner.startTransaction();
      const user = await this.userRepository
        .createQueryBuilder('user')
        .where('id = :userId and removed_at is null', { userId })
        .getOne();

      if (!user) {
        throw new BadRequestException('잘못된 요청입니다.');
      }

      await queryRunner.manager
        .getRepository(Users)
        .createQueryBuilder('user')
        .update(Users)
        .set({ planNotification })
        .where('id = :userId', { userId })
        .execute();

      await queryRunner.commitTransaction();

      return {
        id: userId,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
