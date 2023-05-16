import { Body, Controller, Delete, Get, Query, Post, Put, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { RefreshJwtAuthGuard } from 'src/auth/refresh-jwt-auth.guard';
import { UserDeco } from 'src/common/decorators/user.decorator';
import { SuccessResponseInterceptor } from 'src/common/interceptors/successResponse.interceptor';
import { EmailService } from 'src/email/email.service';
import { Users } from 'src/entities/Users';
import { ChangeMyInfoRequestDto } from './dto/change-my-info.request.dto';
import { SignUpRequestDto } from './dto/sign-up.request.dto';
import { UsersService } from './users.service';

@Controller('/users')
@UseInterceptors(SuccessResponseInterceptor)
export class UsersController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
    private emailService: EmailService
  ) {}

  // 닉네임 변경
  @Put('/nickname')
  @UseGuards(JwtAuthGuard)
  updatePlanChartsOrder(@Body() body: { nickname: string }, @UserDeco() user: Users) {
    return this.userService.updateNickname({ ...body, userId: user.id });
  }

  @Post() // 회원가입
  async signUp(@Body() body: SignUpRequestDto) {
    return await this.userService.signUp(body);
  }

  // res.locals 미들웨어간에 공유할 수 있는 변수역할
  // res.locals.jwt
  @Get() // 로그인한 유저 정보
  @UseGuards(JwtAuthGuard)
  getUser(@UserDeco() user: Users) {
    return user;
  }

  @Put() // 내 정보 수정
  @UseGuards(JwtAuthGuard)
  async putUser(@UserDeco() user: Users, @Body() body: ChangeMyInfoRequestDto) {
    await this.userService.putUser(user, body);
  }

  @Delete('/delete') // 계정 삭제
  @UseGuards(JwtAuthGuard)
  async deleteUser(@UserDeco() user: Users, @Body() body: { password: string }) {
    await this.userService.deleteUser({ ...user, ...body });
  }

  // 로그인
  @Post('/login')
  @UseGuards(LocalAuthGuard)
  async login(@UserDeco() user: Users) {
    const token = await this.authService.login(user);

    return token;
  }

  @Get('/access-token')
  @UseGuards(RefreshJwtAuthGuard)
  async getNewAccessToken(@UserDeco() user: Users) {
    const { newAccessToken } = await this.authService.getTokens(user);

    return newAccessToken;
  }

  // 인증번호 전송
  @Post('/verification-code')
  async postVerificationCode(@Body() body: { email: string }) {
    return await this.emailService.sendVerificationCode(body);
  }

  // 닉네임 랜덤 생성
  @Post('/make-nickname')
  async makeNickname(@Body() body: { to: string }) {
    // return await this.emailService.sendVerificationCode(body);
  }

  // 이메일 중복 체크
  @Get('/check-duplicate-email')
  async checkDuplicateEmail(@Query() query: { email: string }) {
    return await this.userService.checkDuplicateEmail(query);
  }

  @Post('/logout')
  @UseGuards(JwtAuthGuard)
  async logout(@UserDeco() user: Users) {
    return await this.authService.logout(user.id);
  }

  // @Get('/verification-code') // 비밀번호 찾기
  // findPassword() {}

  // @Get('/verification-code/verify') // 인증번호 체크
  // checkVerifyCode() {}
}
