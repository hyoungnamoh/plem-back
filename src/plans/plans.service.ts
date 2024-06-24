import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import dayjs from 'dayjs';
import { Plans } from 'src/entities/Plans';
import { SubPlans } from 'src/entities/SubPlans';
import { Users } from 'src/entities/Users';
import { PlanChartsService } from 'src/plan-charts/plan-charts.service';
import { SubPlanHistoriesService } from 'src/sub-plan-histories/sub-plan-histories.service';
import { Repository } from 'typeorm';
import { CreatePlanDto } from './dto/create-plan.dto';

@Injectable()
export class PlansService {
  constructor(
    @InjectRepository(Plans) private planRepository: Repository<Plans>,
    @InjectRepository(SubPlans) private subPlanRepository: Repository<SubPlans>,
    private planChartService: PlanChartsService,
    private subPlanHistoryService: SubPlanHistoriesService
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

  async getNotificationTargetPlans({ startHour, startMin }: { startHour: number; startMin: number }) {
    const plans = await this.planRepository
      .createQueryBuilder('plan')
      .innerJoinAndSelect('plan.PlanChart', 'planChart')
      .innerJoinAndSelect('planChart.User', 'user')
      .leftJoinAndSelect('user.PushNotifications', 'pushNotification')
      .where('plan.notification IS NOT NULL')
      .andWhere('user.planNotification = :planNotification', { planNotification: 1 })
      .andWhere('planChart.repeats != "[null]"')
      .getMany();

    const current = dayjs();
    const todayPlansWithChart = plans.filter((plan) => {
      const isSpecificRepeat = JSON.parse(plan.PlanChart.repeatDates).includes(current.get('date'));
      const isWeekRepeat = JSON.parse(plan.PlanChart.repeats).includes(current.get('day'));

      return isSpecificRepeat || isWeekRepeat;
    });

    const currentPlans = todayPlansWithChart.filter((todayPlan) => {
      const phoneTokenLength = todayPlan.PlanChart.User.PushNotifications.length;
      if (phoneTokenLength < 1) {
        return false;
      }
      const preNotificationMinute = Number(todayPlan.notification);
      const startTime = dayjs()
        .set('hour', todayPlan.startHour)
        .set('minute', todayPlan.startMin)
        .startOf('m')
        .subtract(preNotificationMinute, 'minute');
      return startTime.get('hour') === startHour && startTime.get('minute') === startMin;
    });

    const targetPlans = currentPlans.map((currentPlan) => {
      return {
        phoneTokens: currentPlan.PlanChart.User.PushNotifications,
        planName: currentPlan.name,
        notification: currentPlan.notification,
      };
    });

    return targetPlans;
  }

  async getDoItNow(user: Users) {
    const todayPlanChart = await this.planChartService.getTodayPlanChart(user);
    if (!todayPlanChart) {
      return { nowPlan: null, nowPlanIndex: -1 };
    }

    const nowPlanIndex = todayPlanChart.plans.findIndex((plan) => {
      const current = dayjs();
      const startTime = dayjs().set('hour', plan.startHour).set('minute', plan.startMin).startOf('minute');
      const endTime = dayjs().set('hour', plan.endHour).set('minute', plan.endMin).startOf('minute');
      const midnight = dayjs().startOf('date');
      // 자정을 포함한 경우의 조건, 자정 기준으로 앞 뒤 시간 비교 필요
      const hasMidnight = endTime.isBefore(startTime);
      const beforeMidnightCondition =
        (current.isBefore(midnight) && current.isSame(startTime)) || current.isAfter(startTime);
      const afterMidnightCondition =
        (current.isSame(midnight) || current.isAfter(midnight)) && current.isBefore(endTime);
      // 자정을 포함하지 않은 경우의 조건
      const generalCondition = (current.isSame(startTime) || current.isAfter(startTime)) && current.isBefore(endTime);
      return hasMidnight ? hasMidnight && (beforeMidnightCondition || afterMidnightCondition) : generalCondition;
    });

    const addIsCompletedForSubPlans = (subPlans: SubPlans[]) => {
      return Promise.all(
        subPlans.map(async (subPlan) => {
          const isCompleted = await this.subPlanHistoryService.getSubPlanHistory({
            subPlanName: subPlan.name,
            userId: user.id,
            date: dayjs().startOf('date').toDate(),
          });
          return { ...subPlan, isCompleted: !!isCompleted };
        })
      );
      // const subPlansWithIsCompleted = Promise.all(promises);
    };

    if (nowPlanIndex === -1) {
      return { nowPlan: null, nowPlanIndex: -1 };
    }

    const nowPlan = todayPlanChart.plans[nowPlanIndex];
    const subPlans = await addIsCompletedForSubPlans(nowPlan.subPlans);
    const nowPlanWithIsCompleted = { ...nowPlan, subPlans };
    return { nowPlan: nowPlanWithIsCompleted, nowPlanIndex };
  }
}
