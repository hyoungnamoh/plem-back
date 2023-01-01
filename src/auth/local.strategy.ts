import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email', passswordField: 'password' });
  }

  async validate(username: string, password: string, done: CallableFunction) {
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException('이메일 또는 비밀번호를 확인해주세요.');
    }
    return done(null, user); // => local-auth-guard.super.login 실행
  }
}
