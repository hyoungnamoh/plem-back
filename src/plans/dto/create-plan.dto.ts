import { PickType } from '@nestjs/swagger';
import { Plans } from 'src/entities/Plans';

export class CreatePlanDto extends PickType(Plans, ['PlanChartId', 'name'] as const) {}
