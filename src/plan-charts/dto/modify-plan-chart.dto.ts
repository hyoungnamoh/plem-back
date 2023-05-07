import { OmitType } from '@nestjs/swagger';
import { PlanCharts } from 'src/entities/PlanCharts';

export class ModifyPlanChartDto extends OmitType(PlanCharts, ['repeats', 'repeatDays'] as const) {
  repeats: (null | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7)[];
  repeatDays: number[];
}
