import { PickType } from '@nestjs/swagger';
import { PlanCharts } from 'src/entities/PlanCharts';

export class ModifyPlanChartDto extends PickType(PlanCharts, ['name', 'id'] as const) {}
