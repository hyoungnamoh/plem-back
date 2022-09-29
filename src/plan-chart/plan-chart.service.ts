import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Plan } from 'src/entities/Plan';
import { PlanChart } from 'src/entities/PlanChart';
import { PlanService } from 'src/plan/plan.service';
import { Repository } from 'typeorm';
import { CreatePlanChartDto } from './dto/create-plan-chart.dto';

@Injectable()
export class PlanChartService {
  constructor(
    @InjectRepository(PlanChart)
    private planChartRepository: Repository<PlanChart>,
    @InjectRepository(Plan)
    private planRepository: Repository<Plan>,
    private planService: PlanService,
  ) {}

  async postPlanChart({
    name,
    Plans,
    userId,
  }: CreatePlanChartDto & { userId: number }) {
    const planChart = new PlanChart();

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
      .from(PlanChart)
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
    //   .from(PlanChart)
    //   .where('id = :id', { id })
    //   .execute();
  }
}
