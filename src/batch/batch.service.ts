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
    const targetPlans = await this.plansService.getNotificationTargetPlans({ startHour, startMin });

    targetPlans.forEach((targetPlan) => {
      targetPlan.phoneTokens.forEach((phoneToken) => {
        this.fcmService.fcm(
          phoneToken.phoneToken,
          '플렘',
          this.getFcmContent({ name: targetPlan.planName, notification: targetPlan.notification, type: 'plan' }),
          'plan'
        );
      });
    });
  }

  @Cron('0 */5 * * * *', { name: 'scheduleNotificationSendCronTask' })
  async scheduleNotificationSendCron() {
    const current = dayjs().startOf('minute');
    const schedulesWithPhoneTokens = await this.scheduleService.getPhoneTokensBySchedule({
      date: current.format('YYYY-MM-DD HH:mm:ss'),
      // date: '2024-03-16 23:55:00',
    });

    schedulesWithPhoneTokens.forEach((target) => {
      target.phoneTokens.forEach((phoneToken) => {
        this.fcmService.fcm(
          phoneToken,
          '플렘',
          this.getFcmContent({ name: target.scheduleName, notification: target.notification, type: 'schedule' }),
          'schedule'
        );
      });
    });
  }

  getFcmContent(fcmData: { name: string; notification: string | null; type: 'plan' | 'schedule' }) {
    const isPlan = fcmData.type === 'plan';
    const typeKor = isPlan ? '계획' : '일정';

    if (fcmData.notification === '0') {
      return `${fcmData.name} ${typeKor} 시간이에요!`;
    }
    if (fcmData.notification === '60') {
      return `${fcmData.name} ${typeKor}이 1시간 뒤 예정되어 있어요!`;
    }
    return `${fcmData.name} ${typeKor}이 ${fcmData.notification}분 뒤 예정되어 있어요!`;
  }
}
