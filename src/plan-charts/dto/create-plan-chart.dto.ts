import { PickType } from '@nestjs/swagger';
import { PlanCharts } from 'src/entities/PlanCharts';

export class CreatePlanChartDto extends PickType(PlanCharts, ['name', 'plans'] as const) {
  repeats: (null | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7)[];
  repeatDates: number[];
}
