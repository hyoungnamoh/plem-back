import { OmitType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, ValidateNested } from 'class-validator';
import { PlanCharts } from 'src/entities/PlanCharts';
import { Plans } from 'src/entities/Plans';

export class UpdatePlanChartDto extends OmitType(PlanCharts, ['repeats', 'repeatDates'] as const) {
  repeats: (null | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7)[];
  repeatDates: number[];
  @IsArray()
  @ArrayNotEmpty({ message: '계획이 비어있습니다.' })
  @ValidateNested()
  @Type(() => OmitType(Plans, ['PlanChartId']))
  plans: Plans[];
}
