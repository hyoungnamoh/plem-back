import { BadRequestException, HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/Users';
import { Repository } from 'typeorm';
import { SignUpRequestDto } from './dto/sign-up.request.dto';
import bcrypt from 'bcrypt';
import { ChangeMyInfoRequestDto } from './dto/change-my-info.request.dto';
@Injectable()
export class UsersService {
  // service(business logic)는 repo(이어주는 역할)를 통해 entitiy(table)에 쿼리를 날림
  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>
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

  async putUser({ email }: Users, { password, nickname, newPassword }: ChangeMyInfoRequestDto) {
    const user = await this.userRepository.findOne({
      where: { email },
      select: ['password'],
    });

    if (!user) {
      throw new UnauthorizedException('존재하지 않는 유저입니다.');
    }

    const result = await bcrypt.compare(password, user.password);

    if (result) {
      const hashedPassword = await bcrypt.hash(password, 12);
    }
  }

  async deleteUser({ email, password }: Users & { password: string }) {
    const user = await this.userRepository.findOne({
      where: { email },
      select: ['password'],
    });

    if (!user) {
      throw new UnauthorizedException('존재하지 않는 유저입니다.');
    }

    const result = await bcrypt.compare(password, user.password);

    if (!result) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다');
    }

    await this.userRepository
      .createQueryBuilder('user')
      .softDelete()
      .from(Users)
      .where('user.email = :email', { email })
      .execute();
  }

  async checkDuplicateEmail({ email }: { email: string }) {
    const user = await this.userRepository.createQueryBuilder('user').where('user.email = :email', { email }).getOne();

    if (user && !user.removedAt) {
      throw new BadRequestException('이미 사용중인 이메일 입니다.');
    }
    return true;
  }
}
