import { PickType } from '@nestjs/swagger';
import { SubPlanHistories } from 'src/entities/SubPlanHistories';

export class CreateSubPlanHistoryDto extends PickType(SubPlanHistories, ['subPlanName', 'UserId', 'date'] as const) {}
