import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/User';
import { Repository } from 'typeorm';
import { SignUpRequestDto } from './dto/sign-up.request.dto';
import bcrypt from 'bcrypt';
@Injectable()
export class UserService {
  // service(business logic)는 repo(이어주는 역할)를 통해 entitiy(table)에 쿼리를 날림
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  async signUp({ email, password, nickname }: SignUpRequestDto) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (user) {
      throw new HttpException('이미 사용중인 이메일입니다!', 401);
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    await this.userRepository.save({
      email,
      nickname,
      password: hashedPassword,
    });
  }
}
