import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { LoggedInGuard } from 'src/auth/logged-in.guard';
import { NotLoggedInGuard } from 'src/auth/not-logged-in.guard';
import { User } from 'src/common/decorators/user.decorator';
import { UndefinedToNullInterceptor } from 'src/common/interceptors/undefinedToNull.interceptor';
import { SignUpRequestDto } from './dto/sign-up.request.dto';
import { UserService } from './user.service';

@UseInterceptors(UndefinedToNullInterceptor)
@Controller('/user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post() // 회원가입
  @UseGuards(new NotLoggedInGuard())
  async signUp(@Body() body: SignUpRequestDto) {
    await this.userService.signUp(body);
  }

  // res.locals 미들웨어간에 공유할 수 있는 변수역할
  // res.locals.jwt
  @Get() // 로그인한 유저 정보
  getUser(@User() user) {
    return user;
  }

  @Put() // 내 정보 수정
  putUser() {}

  @Put() // 계정 삭제
  deleteUser() {}

  @UseGuards(new LocalAuthGuard()) // 주로 권한, 로그인(401, 403) 처리
  @Post('/login') // 로그인
  login(@User() user) {
    return user; // nest가 res.json(user) 로 변환해서 보내줌
  }

  @UseGuards(new LoggedInGuard())
  @Post('/logout') // 로그아웃
  logout() {}

  @UseGuards(new NotLoggedInGuard())
  @Get('/verification-code') // 비밀번호 찾기
  findPassword() {}

  @UseGuards(new NotLoggedInGuard())
  @Post('/verification-code') // 인증번호 전송
  postVerificationCode() {}

  @UseGuards(new NotLoggedInGuard())
  @Get('/verification-code/verify') // 인증번호 체크
  checkVerifyCode() {}
}
