import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import dayjs from 'dayjs';
import { FcmService } from 'src/fcm/fcm.service';
import { PlansService } from 'src/plans/plans.service';
import { SchedulesService } from 'src/schedules/schedules.service';

@Injectable()
export class BatchService {
  constructor(
    private readonly fcmService: FcmService,
    private readonly plansService: PlansService,
    private readonly scheduleService: SchedulesService
  ) {}
  private readonly logger = new Logger(BatchService.name);

  @Cron('0 */5 * * * *', { name: 'planNotificationSendCronTask' })
  async planNotificationSendCron() {
    const current = dayjs();
    const startHour = current.get('hour');
    const startMin = current.get('minute');
    const targetTokensWithPlanName = await this.plansService.getPhoneTokensByPlan({ startHour, startMin });

    targetTokensWithPlanName.forEach((target) => {
      this.fcmService.fcm(target.phoneToken, '플렘', `${target.planName} 시간이에요!`, 'plan');
    });
  }

  @Cron('0 */5 * * * *', { name: 'scheduleNotificationSendCronTask' })
  async scheduleNotificationSendCron() {
    const current = dayjs().startOf('minute');
    const schedulesWithPhoneTokens = await this.scheduleService.getPhoneTokensBySchedule({
      date: current.format('YYYY-MM-DD HH:mm:ss'),
    });

    schedulesWithPhoneTokens.forEach((target) => {
      target.phoneTokens.forEach((phoneToken) => {
        this.fcmService.fcm(
          phoneToken,
          '플렘',
          `${target.scheduleName} 일정이 ${
            target.notification !== 60 ? `${target.notification}분 뒤` : '1시간 뒤'
          } 예정되어 있어요!`,
          'schedule'
        );
      });
    });
  }
}
