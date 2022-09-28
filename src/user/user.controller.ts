import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { UserDeco } from 'src/common/decorators/user.decorator';
import { UndefinedToNullInterceptor } from 'src/common/interceptors/undefinedToNull.interceptor';
import { User } from 'src/entities/User';
import { ChangeMyInfoRequestDto } from './dto/change-my-info.request.dto';
import { SignUpRequestDto } from './dto/sign-up.request.dto';
import { UserService } from './user.service';

@UseInterceptors(UndefinedToNullInterceptor)
@Controller('/user')
export class UserController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Post() // 회원가입
  async signUp(@Body() body: SignUpRequestDto) {
    await this.userService.signUp(body);
  }

  // res.locals 미들웨어간에 공유할 수 있는 변수역할
  // res.locals.jwt
  @Get() // 로그인한 유저 정보
  @UseGuards(JwtAuthGuard)
  getUser(@UserDeco() user: User) {
    return user;
  }

  @Put() // 내 정보 수정
  @UseGuards(JwtAuthGuard)
  async putUser(@UserDeco() user: User, @Body() body: ChangeMyInfoRequestDto) {
    await this.userService.putUser(user, body);
  }

  @Put() // 계정 삭제
  @UseGuards(JwtAuthGuard)
  deleteUser() {}

  @Post('/login')
  @UseGuards(LocalAuthGuard)
  login(@UserDeco() user: User) {
    const token = this.authService.login(user);

    return token;
  }

  @Post('/logout') // 로그아웃
  @UseGuards(JwtAuthGuard)
  logOut() {}

  @Get('/verification-code') // 비밀번호 찾기
  findPassword() {}

  @Post('/verification-code') // 인증번호 전송
  postVerificationCode() {}

  @Get('/verification-code/verify') // 인증번호 체크
  checkVerifyCode() {}
}
