import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Plans as PlansRepo } from 'src/entities/Plans';
import { PlanCharts } from 'src/entities/PlanCharts';
import { DataSource, Repository } from 'typeorm';
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

  async postPlanChart({ name, Plans, userId }: CreatePlanChartDto & { userId: number }) {
    const queryRunner = this.datasource.createQueryRunner();
    queryRunner.connect();
    queryRunner.startTransaction();
    const planChart = new PlanCharts();

    try {
      planChart.UserId = userId;
      planChart.name = name;

      const planChartReturned = await queryRunner.manager.getRepository(PlanCharts).save(planChart);

      const planPromiseArray = Plans.map((plan) => {
        plan.PlanChartId = planChartReturned.id;
        return queryRunner.manager.getRepository(PlansRepo).save(plan);
      });
      const plansReturned = await Promise.all(planPromiseArray);

      const subPlanPromiseArray = plansReturned.map((plan) => {
        return plan.SubPlans.map((subPlan) => {
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
      .where('planChart.id = :id', { id })
      .getOne();
    if (!planChart) {
      throw new NotFoundException('존재하지 않는 일정표입니다.');
    }
    const plans = await this.planRepository
      .createQueryBuilder('plan')
      .where('plan.PlanChartId = :id', { id })
      .getMany();

    Object.assign(planChart, { plans });

    return {
      planChart,
    };
  }

  async deletePlanChart({ id }) {
    const planChart = await this.planChartRepository.findOne({ where: { id } });
    if (!planChart) {
      throw new NotFoundException('존재하지 않는 일정표입니다.');
    }
    await this.planChartRepository.createQueryBuilder().delete().from(PlanCharts).where('id = :id', { id }).execute();
  }

  async getPlanCharts({ page, userId }) {
    const planCharts = await this.planChartRepository.find({
      where: { UserId: userId },
    });
    return planCharts;
  }

  async putPlanChart({ id, name }: ModifyPlanChartDto) {
    const planChart = await this.planChartRepository.findOne({
      where: { id },
    });

    if (!planChart) {
      throw new NotFoundException('존재하지 않는 일정표입니다.');
    }

    await this.planChartRepository
      .createQueryBuilder()
      .update(PlanCharts)
      .set({ name })
      .where('id = :id', { id })
      .execute();
  }
}
