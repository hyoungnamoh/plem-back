import { PickType } from '@nestjs/swagger';
import { Schedules } from 'src/entities/Schedules';

export class UpdateScheduleDto extends PickType(Schedules, [
  'name',
  'category',
  'startDate',
  'endDate',
  'notification',
  'id',
] as const) {
  repeats: (null | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7)[];
}
