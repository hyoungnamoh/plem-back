import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Plans } from 'src/entities/Plans';
import { PlanCharts } from 'src/entities/PlanCharts';
import { PlansService } from 'src/plans/plans.service';
import { Repository } from 'typeorm';
import { CreatePlanChartDto } from './dto/create-plan-chart.dto';

@Injectable()
export class PlanChartsService {
  constructor(
    @InjectRepository(PlanCharts)
    private planChartRepository: Repository<PlanCharts>,
    @InjectRepository(Plans)
    private planRepository: Repository<Plans>,
    private planService: PlansService,
  ) {}

  async postPlanChart({
    name,
    Plans,
    userId,
  }: CreatePlanChartDto & { userId: number }) {
    const planChart = new PlanCharts();

    planChart.UserId = userId;
    planChart.name = name;
    const planChartReturned = await this.planChartRepository.save(planChart);

    const postPlans = Plans.map((plan) => {
      return this.planService.postPlan({
        name: plan.name,
        PlanChartId: planChartReturned.id,
      });
    });

    const plostPlansReturned = await Promise.all(postPlans);
  }

  async getPlanChart({ id }) {
    const planChart = await this.planChartRepository
      .createQueryBuilder('planChart')
      .where('planChart.id = :id', { id })
      .getOne();
    if (!planChart) {
      throw new HttpException('존재하지 않은 일정표입니다.', 401);
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
      throw new HttpException('존자해지 않는 일정표입니다.', 401);
    }
    await this.planChartRepository
      .createQueryBuilder()
      .delete()
      .from(PlanCharts)
      .where('id = :id', { id })
      .execute();
  }

  async getPlanChartList({ page, userId }) {
    const planChartList = await this.planChartRepository.find({
      where: { UserId: userId },
    });
    console.log(planChartList);
    // if (!planChart) {
    //   throw new HttpException('존자해지 않는 일정표입니다.', 401);
    // }
    // await this.planChartRepository
    //   .createQueryBuilder()
    //   .delete()
    //   .from(PlanCharts)
    //   .where('id = :id', { id })
    //   .execute();
  }
}
