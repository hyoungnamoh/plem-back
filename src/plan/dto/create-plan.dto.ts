import { PickType } from '@nestjs/swagger';
import { Plan } from 'src/entities/Plan';

export class CreatePlanDto extends PickType(Plan, [
  'PlanChartId',
  'name',
] as const) {}
