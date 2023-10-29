import { PickType } from '@nestjs/swagger';
import { Schedules } from 'src/entities/Schedules';

export class CreateScheduleDto extends PickType(Schedules, [
  'name',
  'category',
  'startDate',
  'endDate',
  'notification',
  'repeats',
] as const) {}
