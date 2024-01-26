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

  // @Put() // 내 정보 수정
  // @UseGuards(JwtAuthGuard)
  // async putUser(@UserDeco() user: Users, @Body() body: ChangeMyInfoRequestDto) {
  //   await this.userService.putUser(user, body);
  // }

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
  async postVerificationCode(@Body() body: { email: string; isReset?: boolean }) {
    return await this.emailService.sendVerificationCode(body);
  }

  // 이메일 중복 체크
  @Get('/check-duplicate-email')
  async checkDuplicateEmail(@Query() query: { email: string }) {
    return await this.userService.checkDuplicateEmail(query);
  }

  @Post('/logout')
  @UseGuards(JwtAuthGuard)
  async logout(@UserDeco() user: Users, @Body() body: { phoneToken: string }) {
    return await this.authService.logout({ userId: user.id, ...body });
  }

  // 닉네임 변경
  @Put('/nickname')
  @UseGuards(JwtAuthGuard)
  async updateNickname(@Body() body: { nickname: string }, @UserDeco() user: Users) {
    return await this.userService.updateNickname({ ...body, userId: user.id });
  }

  // 비밀번호 변경
  @Put('/password')
  async updatePassword(@Body() body: { email: string; currentPassword: string; newPassword: string }) {
    return await this.userService.updatePassword(body);
  }

  // 비밀번호 초기화
  @Put('/password/init')
  async initPassword(@Body() body: { email: string; password: string }) {
    return await this.userService.initPassword(body);
  }

  // 이메일 변경
  @Put('/email')
  @UseGuards(JwtAuthGuard)
  async updateEmail(@Body() body: { newEmail: string }, @UserDeco() user: Users) {
    return await this.userService.updateEmail({ ...body, userId: user.id });
  }
}
