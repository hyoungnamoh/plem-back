import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import dayjs from 'dayjs';
import { FcmService } from 'src/fcm/fcm.service';
import { PlansService } from 'src/plans/plans.service';

@Injectable()
export class BatchService {
  constructor(private readonly fcmService: FcmService, private readonly plansService: PlansService) {}
  private readonly logger = new Logger(BatchService.name);

  @Cron('0 */5 * * * *', { name: 'fcmSendCronTask' })
  async handleFcmSendCron() {
    this.logger.log(new Date());
    const current = dayjs();
    const startHour = current.get('hour');
    const startMin = current.get('minute');
    const targetTokensWithPlanName = await this.plansService.getPhoneTokensByPlan({ startHour, startMin });

    targetTokensWithPlanName.forEach((target) => {
      this.fcmService.fcm(target.phoneToken, '플렘', `${target.planName} 시간이에요!`, 'plan');
    });
  }
}
