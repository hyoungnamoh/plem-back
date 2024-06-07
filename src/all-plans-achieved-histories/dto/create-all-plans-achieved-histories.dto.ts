import { PickType } from '@nestjs/swagger';
import { AllPlansAchievedHistories } from 'src/entities/AllPlansAchievedHistories';

export class CreateAllPlansAchievedHistoryDto extends PickType(AllPlansAchievedHistories, ['PlanChartId'] as const) {}
