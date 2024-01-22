import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import dayjs from 'dayjs';
import { Plans } from 'src/entities/Plans';
import { PushNotifications } from 'src/entities/PushNotifications';
import { SubPlans } from 'src/entities/SubPlans';
import { Users } from 'src/entities/Users';
import { PlanChartsService } from 'src/plan-charts/plan-charts.service';
import { Repository } from 'typeorm';
import { CreatePlanDto } from './dto/create-plan.dto';

@Injectable()
export class PlansService {
  constructor(
    @InjectRepository(Plans) private planRepository: Repository<Plans>,
    @InjectRepository(SubPlans) private subPlanRepository: Repository<SubPlans>,
    @Inject(forwardRef(() => PlanChartsService))
    private planChartService: PlanChartsService,
    @InjectRepository(Users) private userRepository: Repository<Users>,
    @InjectRepository(PushNotifications) private pushNotificationRepository: Repository<PushNotifications>
  ) {}

  async getPlan({ id }: { id: number }) {
    const plan = await this.planRepository.findOne({ where: { id } });
    if (!plan) {
      throw new NotFoundException('존재하지 않는 계획입니다.');
    }

    const subPlans = await this.subPlanRepository
      .createQueryBuilder('subPlans')
      .where('subPlans.PlanId = :id', { id })
      .getMany();

    Object.assign(plan, { subPlans });

    return { plan };
  }

  async postPlan({ name, PlanChartId }: CreatePlanDto) {
    const plan = new Plans();
    plan.name = name;
    plan.PlanChartId = PlanChartId;
    const planReturned = await this.planRepository.save(plan);
    return planReturned;
  }

  async deletePlan({ id }: { id: number }) {
    if (id === 9999) {
      await this.planRepository.createQueryBuilder().delete().from(Plans).execute();
      return;
    }
    const deletedResult = await this.planRepository
      .createQueryBuilder()
      .delete()
      .from(Plans)
      .where('id = :id', { id })
      .execute();

    if (deletedResult.affected && deletedResult.affected < 1) {
      throw new NotFoundException('삭제할 계획이 존재하지 않습니다.');
    }
  }

  async getPhoneTokensByPlan({ startHour, startMin }: { startHour: number; startMin: number }) {
    const users = await this.userRepository.createQueryBuilder().where('removed_at is null').getMany();
    const todayPlanCharts = users.map((user) => {
      return this.planChartService.getTodayPlanChart(user);
    });

    const resolvedTodayPlanCharts = await Promise.all(todayPlanCharts);
    const todayPlanChartIds = resolvedTodayPlanCharts.filter((chart) => chart).map((planChart) => planChart?.id);

    if (todayPlanChartIds.length === 0) {
      return [];
    }

    const plans = await this.planRepository
      .createQueryBuilder()
      .where('plan_chart_id IN (:...todayPlanChartIds) and notification is not null', { todayPlanChartIds })
      .getMany();

    const targetPlans = plans.filter((plan) => {
      const preNotificationMinute = Number(plan.notification);
      const dd = dayjs()
        .set('hour', plan.startHour)
        .set('minute', plan.startMin)
        .startOf('m')
        .subtract(preNotificationMinute, 'minute');
      return dd.get('hour') === startHour && dd.get('minute') === startMin;
    });

    const targetChartIdsWithPlanName = targetPlans.map((targetPlan) => {
      return {
        planName: targetPlan.name,
        chartId: targetPlan.PlanChartId,
      };
    });
    const targetUserIdsWithPlanName = targetChartIdsWithPlanName.map((target) => {
      return {
        userId: resolvedTodayPlanCharts.find((todayPlanChart) => todayPlanChart?.id === target.chartId)?.UserId,
        planName: target.planName,
      };
    });

    const validTargetUserIdsWithPlanName = targetUserIdsWithPlanName.filter((target) => target);
    if (validTargetUserIdsWithPlanName.length === 0) {
      return [];
    }

    const targetPushNotifications = await this.pushNotificationRepository
      .createQueryBuilder('pushNotifications')
      .where('pushNotifications.user_id IN (:...targetUserIds)', {
        targetUserIds: validTargetUserIdsWithPlanName.map((target) => target.userId),
      })
      .getMany();

    const targetPhoneTokensWithUserId = targetPushNotifications.map((pushNotification) => {
      return {
        userId: pushNotification.UserId,
        phoneToken: pushNotification.phoneToken,
      };
    });

    const result: { phoneToken: string; planName: string }[] = [];
    targetPhoneTokensWithUserId.forEach((phoneTokenWithUserId) => {
      const userWithPlanName = validTargetUserIdsWithPlanName.filter(
        (userIdWithPlanName) => userIdWithPlanName.userId === phoneTokenWithUserId.userId
      );
      userWithPlanName.forEach((userWithPlanName) => {
        result.push({
          phoneToken: phoneTokenWithUserId.phoneToken,
          planName: userWithPlanName.planName,
        });
      });
    });

    return result;
  }
}
