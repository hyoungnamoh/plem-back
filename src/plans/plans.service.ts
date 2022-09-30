import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Plans } from 'src/entities/Plans';
import { Repository } from 'typeorm';
import { CreatePlanDto } from './dto/create-plan.dto';

@Injectable()
export class PlansService {
  constructor(
    @InjectRepository(Plans) private planRepository: Repository<Plans>,
  ) {}

  async getPlan({ id }: { id: number }) {
    return this.planRepository.findOne({ where: { id } });
  }

  async postPlan({ name, PlanChartId }: CreatePlanDto) {
    const plan = new Plans();
    plan.name = name;
    plan.PlanChartId = PlanChartId;
    const planReturned = await this.planRepository.save(plan);
    return planReturned;
  }
}
