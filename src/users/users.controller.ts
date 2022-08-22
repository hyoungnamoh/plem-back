import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { User } from 'src/common/decorators/user.decorator';
import { UndefinedToNullInterceptor } from 'src/common/interceptors/undefinedToNull.interceptor';
import { SignUpRequestDto } from './dto/sign-up.request.dto';
import { UsersService } from './users.service';

@UseInterceptors(UndefinedToNullInterceptor)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('signUp') // 회원가입
  signUp(@Body() data: SignUpRequestDto) {
    this.usersService.signUp(data.email, data.password, data.nickname);
  }

  @Post('logIn') // 로그인
  logIn(@User() user) {
    return user; // nest가 res.json(user) 로 변환해서 보내줌
  }

  @Post('logOut') // 로그아웃
  logOut() {}

  @Get() // 로그인한 유저 정보
  // res.locals 미들웨어간에 공유할 수 있는 변수역할
  // res.locals.jwt
  getUser(@User() user) {
    return user;
  }

  @Put(':id') // 내 정보 수정
  putUser() {}

  @Get('findPassword') // 비밀번호 찾기
  findPassword() {}

  @Post('verificationCode') // 인증번호 전송
  postVerificationCode() {}

  @Get('verificationCode') // 인증번호 체크
  checkVerifyCode() {}
}
