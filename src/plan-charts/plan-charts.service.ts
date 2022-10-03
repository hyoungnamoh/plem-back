import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Plans } from 'src/entities/Plans';
import { PlanCharts } from 'src/entities/PlanCharts';
import { PlansService } from 'src/plans/plans.service';
import { Repository } from 'typeorm';
import { CreatePlanChartDto } from './dto/create-plan-chart.dto';
import { ModifyPlanChartDto } from './dto/modify-plan-chart.dto';

@Injectable()
export class PlanChartsService {
  constructor(
    @InjectRepository(PlanCharts)
    private planChartRepository: Repository<PlanCharts>,
    @InjectRepository(Plans)
    private planRepository: Repository<Plans>,
    private planService: PlansService
  ) {}

  async postPlanChart({ name, Plans, userId }: CreatePlanChartDto & { userId: number }) {
    const planChart = new PlanCharts();

    planChart.UserId = userId;
    planChart.name = name;
    const planChartReturned = await this.planChartRepository.save(planChart);

    const postPlans = Plans.map((plan) => {
      plan.PlanChartId = planChartReturned.id;
      return this.planRepository.save(plan);
    });

    const plostPlansReturned = await Promise.all(postPlans);
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
