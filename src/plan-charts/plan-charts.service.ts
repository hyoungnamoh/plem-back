import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Plans as PlansRepo } from 'src/entities/Plans';
import { PlanCharts } from 'src/entities/PlanCharts';
import { DataSource, Repository, createQueryBuilder } from 'typeorm';
import { CreatePlanChartDto } from './dto/create-plan-chart.dto';
import { ModifyPlanChartDto } from './dto/modify-plan-chart.dto';
import { SubPlans } from 'src/entities/SubPlans';

@Injectable()
export class PlanChartsService {
  constructor(
    @InjectRepository(PlanCharts)
    private planChartRepository: Repository<PlanCharts>,
    @InjectRepository(PlansRepo)
    private planRepository: Repository<PlansRepo>,
    @InjectRepository(SubPlans)
    private subPlanRepository: Repository<SubPlans>,
    private datasource: DataSource
  ) {}

  async postPlanChart({ name, plans, userId, repeats, repeatDays }: CreatePlanChartDto & { userId: number }) {
    const queryRunner = this.datasource.createQueryRunner();
    queryRunner.connect();
    queryRunner.startTransaction();
    const planChart = new PlanCharts();

    try {
      // 선택일 반복일 경우
      if (repeats.includes(7) && repeatDays.length === 0) {
        throw new BadRequestException('반복 선택일이 없습니다.');
      }

      const maxRow = await this.planChartRepository.manager.query(
        `select MAX(order_num) as max_order_num from plan_charts where removed_at is null and user_id =${userId}`
      );
      const maxOrderNum = maxRow[0]?.max_order_num;
      if (typeof maxOrderNum !== 'number') {
        throw new InternalServerErrorException('문제가 발생하였습니다. 01036423603으로 연락바랍니다.');
      }

      planChart.UserId = userId;
      planChart.name = name;
      planChart.repeats = JSON.stringify(repeats);
      planChart.order_num = maxOrderNum + 1;

      planChart.repeatDays = JSON.stringify(repeatDays);

      const planChartReturned = await queryRunner.manager.getRepository(PlanCharts).save(planChart);

      const planPromiseArray = plans.map((plan) => {
        plan.PlanChartId = planChartReturned.id;
        return queryRunner.manager.getRepository(PlansRepo).save(plan);
      });
      const plansReturned = await Promise.all(planPromiseArray);

      const subPlanPromiseArray = plansReturned.map((plan) => {
        return plan.subPlans.map((subPlan) => {
          subPlan.PlanId = plan.id;

          return queryRunner.manager.getRepository(SubPlans).save(subPlan);
        });
      });

      for (let i = 0; i < subPlanPromiseArray.length; i++) {
        const subPlanPromise = subPlanPromiseArray[i];
        await Promise.all(subPlanPromise);
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

  async getPlanChart({ id }) {
    // 오더바이 추가 필요
    const planChart = await this.planChartRepository
      .createQueryBuilder('planChart')
      .where('planChart.id = :id and planChart.removed_at is null', { id })
      .getOne();
    if (!planChart) {
      throw new NotFoundException('존재하지 않는 일정표입니다.');
    }
    const plans = await this.planRepository
      .createQueryBuilder('plan')
      .where('plan.PlanChartId = :id and plan.removed_at is null', { id })
      .getMany();

    const plansWithSubPlansPromise = plans.map(async (plan) => {
      const subPlans = await this.subPlanRepository
        .createQueryBuilder('sub')
        .where('sub.PlanId = :id and sub.removed_at is null', { id: plan.id })
        .getMany();

      return Object.assign(plan, { subPlans });
    });
    const plansWithSubPlans = await Promise.all(plansWithSubPlansPromise);

    const chartWithPlans = Object.assign(planChart, { plans: plansWithSubPlans });

    return {
      ...chartWithPlans,
    };
  }

  async deletePlanChart({ id }) {
    const planChart = await this.planChartRepository
      .createQueryBuilder('planChart')
      .where('planChart.id = :id and removed_at is null', { id })
      .getOne();

    if (!planChart) {
      throw new NotFoundException('존재하지 않는 일정표입니다.');
    }

    await this.planChartRepository.softDelete(id);
  }

  async getPlanCharts({ page, userId }) {
    const planCharts = await this.planChartRepository
      .createQueryBuilder('chart')
      .where('chart.UserId = :userId and chart.removed_at is null', { userId, removedAt: null })
      .getMany();
    console.log(planCharts);
    const chartWithPlans = planCharts.map(async (chart) => {
      const plans = await this.planRepository
        .createQueryBuilder('plan')
        .where('plan.PlanChartId = :id and plan.removed_at is null', { id: chart.id })
        .getMany();
      const planWithSubPlansPromise = plans.map(async (plan) => {
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

  async putPlanChart({ id, name }: ModifyPlanChartDto) {
    const planChart = await this.planChartRepository.findOne({
      where: { id, removedAt: null },
    });

    if (!planChart) {
      throw new NotFoundException('존재하지 않는 일정표입니다.');
    }

    await this.planChartRepository
      .createQueryBuilder()
      .update(PlanCharts)
      .set({ name })
      .where('id = :id and removed_at is null', { id })
      .execute();
  }
}
