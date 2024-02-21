import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Plans } from 'src/entities/Plans';
import { PlanCharts } from 'src/entities/PlanCharts';
import { DataSource, Repository } from 'typeorm';
import { CreatePlanChartDto } from './dto/create-plan-chart.dto';
import { UpdatePlanChartDto } from './dto/update-plan-chart.dto';
import { SubPlans } from 'src/entities/SubPlans';
import { PlansService } from 'src/plans/plans.service';
import { UpdatePlanChartOrdersDto } from './dto/update-plan-chart-orders.dto';
import { Users } from 'src/entities/Users';
import dayjs from 'dayjs';

@Injectable()
export class PlanChartsService {
  constructor(
    @InjectRepository(PlanCharts)
    private planChartRepository: Repository<PlanCharts>,
    @InjectRepository(Plans)
    private planRepository: Repository<Plans>,
    @InjectRepository(SubPlans)
    private subPlanRepository: Repository<SubPlans>,
    private datasource: DataSource,
    @Inject(forwardRef(() => PlansService))
    private plansService: PlansService
  ) {}

  async postPlanChart({ name, plans, userId, repeats, repeatDates }: CreatePlanChartDto & { userId: number }) {
    const queryRunner = this.datasource.createQueryRunner();
    queryRunner.connect();
    queryRunner.startTransaction();
    const planChart = new PlanCharts();

    try {
      const planChartCount = await this.planChartRepository
        .createQueryBuilder('chart')
        .where('chart.UserId = :userId and chart.removed_at is null', { userId })
        .getCount();

      const duplicatedPlanChart = await this.planChartRepository
        .createQueryBuilder('chart')
        .where('chart.name = :name and chart.UserId = :userId and chart.removed_at is null', { name, userId })
        .getOne();

      if (duplicatedPlanChart) {
        throw new BadRequestException('계획표 이름이 중복됩니다. 계획표 이름을 변경해주세요.');
      }

      if (planChartCount >= 10) {
        throw new BadRequestException('계획표는 최대 10개까지 생성할 수 있습니다.');
      }
      if (repeats.includes(7) && repeatDates.length === 0) {
        throw new BadRequestException('반복일을 선택해주세요.');
      }

      const duplicatedRepeatChart = await this.checkDuplicatedRepeatDay({
        userId,
        newChartRepeats: repeats,
        newChartRepeatDates: repeatDates,
      });

      if (duplicatedRepeatChart) {
        throw new BadRequestException(`"${duplicatedRepeatChart.name}" 일정표와 반복일이 중복됩니다.`);
      }

      const maxRow = await this.planChartRepository.manager.query(
        `select MAX(order_num) as max_order_num from plan_charts where removed_at is null and user_id =${userId}`
      );

      if (!maxRow || maxRow.length < 1) {
        throw new InternalServerErrorException('문제가 발생하였습니다. 01036423603으로 연락바랍니다.');
      }

      const maxOrderNum = maxRow[0].max_order_num === null ? 0 : maxRow[0].max_order_num;

      planChart.UserId = userId;
      planChart.name = name;
      planChart.repeats = JSON.stringify(repeats);
      planChart.orderNum = maxOrderNum + 1;
      planChart.repeatDates = JSON.stringify(repeatDates);

      const planChartReturned = await queryRunner.manager.getRepository(PlanCharts).save(planChart);
      const planPromiseArray = plans.map((plan) => {
        plan.PlanChartId = planChartReturned.id;
        return queryRunner.manager.getRepository(Plans).save(plan);
      });
      const plansReturned = await Promise.all(planPromiseArray);

      await Promise.all(
        plansReturned.map(async (plan) => {
          return await Promise.all(
            plan.subPlans.map((subPlan) => {
              subPlan.PlanId = plan.id;
              return queryRunner.manager.getRepository(SubPlans).save(subPlan);
            })
          );
        })
      );

      await queryRunner.commitTransaction();

      return;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getTodayPlanChart(user: Users) {
    // 오더바이 추가 필요
    const planCharts = await this.planChartRepository
      .createQueryBuilder('planChart')
      .where('planChart.removed_at is null and planChart.UserId = :userId', {
        userId: user.id,
      })
      .getMany();

    if (planCharts.length === 0) {
      return null;
    }

    const dateRepeatChart = planCharts.find((chart) => {
      return JSON.parse(chart.repeatDates).includes(dayjs().get('date'));
    });
    if (dateRepeatChart) {
      return this.getPlanChart({ id: dateRepeatChart.id }, user);
    }

    const dayRepeatChart = planCharts.find((chart) => {
      return JSON.parse(chart.repeats).includes(dayjs().get('day'));
    });
    if (dayRepeatChart) {
      return this.getPlanChart({ id: dayRepeatChart.id }, user);
    }

    return null;
  }

  async getPlanChart({ id }: { id: number }, user: Users) {
    // 오더바이 추가 필요
    const planChart = await this.planChartRepository
      .createQueryBuilder('planChart')
      .where('planChart.id = :id and planChart.removed_at is null and planChart.UserId = :userId', {
        id,
        userId: user.id,
      })
      .getOne();
    if (!planChart) {
      throw new NotFoundException('존재하지 않는 일정표입니다.');
    }

    planChart.repeatDates = JSON.parse(planChart.repeatDates);
    planChart.repeats = JSON.parse(planChart.repeats);
    const plans = await this.planRepository
      .createQueryBuilder('plan')
      .where('plan.PlanChartId = :id', { id })
      .getMany();

    const plansWithSubPlansPromise = plans
      .sort(
        (a, b) =>
          dayjs().set('hour', a.startHour).set('minute', a.startMin).unix() -
          dayjs().set('hour', b.startHour).set('minute', b.startMin).unix()
      )
      .map(async (plan) => {
        const subPlans = await this.subPlanRepository
          .createQueryBuilder('sub')
          .where('sub.PlanId = :id and sub.removed_at is null', { id: plan.id })
          .getMany();

        return Object.assign(plan, { subPlans });
      });
    const plansWithSubPlans = await Promise.all(plansWithSubPlansPromise);

    const chartWithPlans = Object.assign(planChart, { plans: plansWithSubPlans });

    return chartWithPlans;
  }

  async deletePlanChart({ id }) {
    const planChart = await this.planChartRepository
      .createQueryBuilder('planChart')
      .where('planChart.id = :id and removed_at is null', { id })
      .getOne();

    if (!planChart) {
      throw new NotFoundException('존재하지 않는 일정표입니다.');
    }

    await this.planChartRepository.delete(id);
  }

  async getPlanCharts({ userId }: { userId: number }) {
    const planCharts = await this.planChartRepository
      .createQueryBuilder('chart')
      .where('chart.UserId = :userId and chart.removed_at is null', { userId })
      .orderBy('chart.order_num', 'ASC')
      .getMany();

    const chartWithPlans = planCharts.map(async (chart, index) => {
      chart.repeatDates = JSON.parse(chart.repeatDates);
      chart.repeats = JSON.parse(chart.repeats);
      const plans = await this.planRepository
        .createQueryBuilder('plan')
        .where('plan.PlanChartId = :id and plan.removed_at is null', { id: chart.id })
        .getMany();
      const planWithSubPlansPromise = plans
        .sort(
          (a, b) =>
            dayjs().set('hour', a.startHour).set('minute', a.startMin).unix() -
            dayjs().set('hour', b.startHour).set('minute', b.startMin).unix()
        )
        .map(async (plan) => {
          const subPlans = await this.subPlanRepository
            .createQueryBuilder('sub')
            .where('sub.plan = :id and sub.removed_at is null', { id: plan.id })
            .getMany();
          Object.assign(plan, { subPlans });
          return plan;
        });
      const plansWithSubPlans = await Promise.all(planWithSubPlansPromise);
      Object.assign(chart, { plans: plansWithSubPlans });
      return chart;
    });

    return await Promise.all(chartWithPlans);
  }

  async updatePlanChart({ id, name, plans, repeatDates, repeats, userId }: UpdatePlanChartDto & { userId: number }) {
    const queryRunner = this.datasource.createQueryRunner();
    queryRunner.connect();
    queryRunner.startTransaction();

    try {
      const planChart = await queryRunner.manager.getRepository(PlanCharts).findOne({
        where: { id },
      });
      if (!planChart) {
        throw new NotFoundException('존재하지 않는 일정표입니다.');
      }

      const duplicatedRepeatChart = await this.checkDuplicatedRepeatDay({
        userId,
        newChartId: id,
        newChartRepeats: repeats,
        newChartRepeatDates: repeatDates,
      });

      if (duplicatedRepeatChart) {
        throw new BadRequestException(`"${duplicatedRepeatChart.name}" 일정표와 반복일이 중복됩니다.`);
      }
      const originPlans = await queryRunner.manager
        .getRepository(Plans)
        .createQueryBuilder()
        .where('plan_chart_id = :chartId and removed_at is null', { chartId: planChart.id })
        .getMany();

      await Promise.all(originPlans.map((plan) => this.plansService.deletePlan({ id: plan.id })));

      const newPlans = await Promise.all(
        plans.map(async (plan) => {
          plan.PlanChartId = planChart.id;
          const { id, updatedAt, removedAt, ...planWithoutId } = plan;

          return queryRunner.manager.getRepository(Plans).save(planWithoutId);
        })
      );

      await Promise.all(
        newPlans.map(async (plan) => {
          return await Promise.all(
            plan.subPlans.map((subPlan) => {
              subPlan.PlanId = plan.id;
              const { id, updatedAt, removedAt, ...subPlanWithoutId } = subPlan;

              return queryRunner.manager.getRepository(SubPlans).save(subPlanWithoutId);
            })
          );
        })
      );

      // 선택일 반복일 경우
      if (repeats.includes(7) && repeatDates.length === 0) {
        throw new BadRequestException('반복 선택일이 없습니다.');
      }

      planChart.name = name;
      planChart.repeats = JSON.stringify(repeats);
      planChart.repeatDates = JSON.stringify(repeatDates);

      const dd = await queryRunner.manager
        .getRepository(PlanCharts)
        .createQueryBuilder()
        .update(PlanCharts)
        .set({ name, repeatDates: JSON.stringify(repeatDates), repeats: JSON.stringify(repeats) })
        .where('id = :id and removed_at is null', { id })
        .execute();

      await queryRunner.commitTransaction();
      // return planChartReturned;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async updatePlanChartsOrder({ userId, chartOrders }: UpdatePlanChartOrdersDto) {
    const queryRunner = this.datasource.createQueryRunner();
    queryRunner.connect();
    queryRunner.startTransaction();
    try {
      const originCharts = await queryRunner.manager
        .getRepository(PlanCharts)
        .createQueryBuilder()
        .where('user_id = :userId and removed_at is null', { userId })
        .orderBy('order_num', 'ASC')
        .getMany();

      const originChartOrders = originCharts.map((chart) => {
        return { id: chart.id, order: chart.orderNum };
      });
      const updateTargets = chartOrders.filter((updateChart, index) => updateChart.id !== originChartOrders[index].id);
      const results = await Promise.all(
        updateTargets.map((chartOrder) => {
          return queryRunner.manager
            .getRepository(PlanCharts)
            .createQueryBuilder()
            .update(PlanCharts)
            .set({ orderNum: chartOrder.order })
            .where('id = :id and removed_at is null', { id: chartOrder.id })
            .execute();
        })
      );

      if (results.find((result) => result.affected === 0)) {
        throw new NotFoundException('순서 변경에 실패했습니다. 다시 시도해주세요.');
      }
      await queryRunner.commitTransaction();

      return;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async clonePlanChart(body: { id: number }, user: Users) {
    const queryRunner = this.datasource.createQueryRunner();
    queryRunner.connect();
    queryRunner.startTransaction();

    try {
      const planChartCount = await this.planChartRepository
        .createQueryBuilder('chart')
        .where('chart.UserId = :userId and chart.removed_at is null', { userId: user.id })
        .getCount();

      if (planChartCount >= 10) {
        throw new BadRequestException('계획표는 최대 10개까지 생성할 수 있습니다.');
      }

      const targetPlanChart = await this.getPlanChart(body, user);
      if (!targetPlanChart) {
        throw new NotFoundException('존재하지 않는 일정표입니다.');
      }

      const copiedPlans = await Promise.all(
        targetPlanChart.plans.map((plan) => {
          plan.PlanChartId = targetPlanChart.id;
          const { id, updatedAt, removedAt, ...planWithoutId } = plan;
          return queryRunner.manager.getRepository(Plans).save(planWithoutId);
        })
      );

      await Promise.all(
        copiedPlans.map(async (plan) => {
          return await Promise.all(
            plan.subPlans.map((subPlan) => {
              subPlan.PlanId = plan.id;
              const { id, updatedAt, removedAt, ...subPlanWithoutId } = subPlan;

              return queryRunner.manager.getRepository(SubPlans).save(subPlanWithoutId);
            })
          );
        })
      );

      targetPlanChart.name = targetPlanChart.name + ' Copy';
      const { id, removedAt, updatedAt, ...copiedPlanChart } = targetPlanChart;

      copiedPlanChart.repeatDates = JSON.stringify([]);
      copiedPlanChart.repeats = JSON.stringify([null]);
      const planChartReturned = await queryRunner.manager.getRepository(PlanCharts).save(copiedPlanChart);
      planChartReturned.repeatDates = JSON.parse(planChartReturned.repeatDates);
      planChartReturned.repeats = JSON.parse(planChartReturned.repeats);

      await queryRunner.commitTransaction();
      return planChartReturned;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getOnlyPlanCharts({ userId }) {
    const planCharts = await this.planChartRepository
      .createQueryBuilder('chart')
      .where('chart.UserId = :userId and chart.removed_at is null', { userId })
      .getMany();

    return planCharts;
  }

  async checkDuplicatedRepeatDay({
    userId,
    newChartId,
    newChartRepeats,
    newChartRepeatDates,
  }: {
    userId: number;
    newChartId?: number;
    newChartRepeats: CreatePlanChartDto['repeats'];
    newChartRepeatDates: CreatePlanChartDto['repeatDates'];
  }) {
    const charts = await this.getOnlyPlanCharts({ userId });
    // 안함일 경우 체크 안함
    if (newChartRepeats.includes(null)) {
      return false;
    }

    // 날짜 지정의 경우 지정한 날짜 중복 체크
    if (newChartRepeats.includes(7)) {
      return charts.find((chart) => {
        if (newChartId && chart.id === newChartId) {
          return false;
        }

        const repeatDates = JSON.parse(chart.repeatDates) as CreatePlanChartDto['repeatDates'];
        return repeatDates.find((repeatDate) => newChartRepeatDates.includes(repeatDate));
      });
    }

    // 중복 요일 체크
    return charts.find((chart) => {
      if (newChartId && chart.id === newChartId) {
        return false;
      }

      const repeats = JSON.parse(chart.repeats) as CreatePlanChartDto['repeats'];
      // 월요일일 경우 0이므로 falsy값 처리
      return typeof repeats.find((repeat) => newChartRepeats.includes(repeat)) === 'number';
    });
  }

  async getPlanChartsCount({ userId }) {
    const count = await this.planChartRepository
      .createQueryBuilder('chart')
      .where('chart.UserId = :userId and chart.removed_at is null', { userId })
      .getCount();

    return { count };
  }
}
