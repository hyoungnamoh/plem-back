import { Body, Controller, Delete, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserDeco } from 'src/common/decorators/user.decorator';
import { Users } from 'src/entities/Users';
import { PushNotificationsService } from './push-notifications.service';
import { SuccessResponseInterceptor } from 'src/common/interceptors/successResponse.interceptor';
import { PushNotifications } from 'src/entities/PushNotifications';

@Controller('/push-notifications')
@UseInterceptors(SuccessResponseInterceptor)
export class PushNotificationsController {
  constructor(private noticeService: PushNotificationsService) {}

  @Post('')
  @UseGuards(JwtAuthGuard)
  async postPushNotification(@Body() body: { phoneToken: PushNotifications['phoneToken'] }, @UserDeco() user: Users) {
    return await this.noticeService.postPushNotification({ ...body, userId: user.id });
  }

  @Delete('')
  @UseGuards(JwtAuthGuard)
  async deletePushNotification(@Body() body: { phoneToken: PushNotifications['phoneToken'] }, @UserDeco() user: Users) {
    return await this.noticeService.deletePushNotification({ ...body, userId: user.id });
  }

  // @Get('')
  // @UseGuards(JwtAuthGuard)
  // getPushNotifications() {
  //   return this.noticeService.getPushNotifications();
  // }

  // @Delete('/:id')
  // @UseGuards(JwtAuthGuard)
  // deletePushNotification(@Param() param: { id: number }, @UserDeco() user: Users) {
  //   return this.noticeService.deletePushNotification({ ...param, userId: user.id });
  // }
}
