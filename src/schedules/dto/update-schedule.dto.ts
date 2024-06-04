import { PickType } from '@nestjs/swagger';
import { Schedules } from 'src/entities/Schedules';

export class UpdateScheduleDto extends PickType(Schedules, [
  'name',
  'category',
  'startDate',
  'endDate',
  'notification',
  'id',
  'repeats',
  'repeatEndDate',
  'memo',
] as const) {}
