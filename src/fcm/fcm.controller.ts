import { Controller, UseInterceptors, UseGuards, Post, Body } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserDeco } from 'src/common/decorators/user.decorator';
import { SuccessResponseInterceptor } from 'src/common/interceptors/successResponse.interceptor';
import { Users } from 'src/entities/Users';
import { FcmService } from './fcm.service';

@Controller('fcm')
@UseInterceptors(SuccessResponseInterceptor)
export class FcmController {
  constructor(private fcmService: FcmService) {}

  @Post('topic')
  @UseGuards(JwtAuthGuard)
  // FIXME 관리자만 사용 가능하도록 수정
  async postFcmTopic(
    @Body()
    body: {
      topic: string;
      title: string;
      message: string;
      channel: string;
    },
    @UserDeco() user: Users
  ) {
    return await this.fcmService.postFcmTopic({ ...body, userId: user.id });
  }
}
