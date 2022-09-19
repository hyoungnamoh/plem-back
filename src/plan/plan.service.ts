import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Plan } from 'src/entities/Plan';
import { Repository } from 'typeorm';
import { CreatePlanDto } from './dto/create-plan.dto';

@Injectable()
export class PlanService {
  constructor(
    @InjectRepository(Plan) private planRepository: Repository<Plan>,
  ) {}

  async getPlan({ id }: { id: number }) {
    return this.planRepository.findOne({ where: { id } });
  }

  async postPlan({ name, PlanChartId }: CreatePlanDto) {
    const plan = new Plan();
    plan.name = name;
    plan.PlanChartId = PlanChartId;
    const planReturned = await this.planRepository.save(plan);
    return planReturned;
  }
}
