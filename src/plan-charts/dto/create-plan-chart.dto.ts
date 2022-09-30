import { PickType } from '@nestjs/swagger';
import { Plans } from 'src/entities/Plans';
import { PlanCharts } from 'src/entities/PlanCharts';

export class CreatePlanChartDto extends PickType(PlanCharts, [
  'name',
  'Plans',
] as const) {}
