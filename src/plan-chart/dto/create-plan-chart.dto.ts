import { PickType } from '@nestjs/swagger';
import { Plan } from 'src/entities/Plan';
import { PlanChart } from 'src/entities/PlanChart';

export class CreatePlanChartDto extends PickType(PlanChart, [
  'name',
  'Plans',
] as const) {}
