import { Module } from '@nestjs/common';
import { BatchService } from './batch.service';
import { BatchController } from './batch.controller';
import { ScheduleModule as NestScheduleModule } from '@nestjs/schedule';
import { FcmService } from 'src/fcm/fcm.service';
import { PlansService } from 'src/plans/plans.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Plans } from 'src/entities/Plans';
import { SubPlans } from 'src/entities/SubPlans';
import { PlanCharts } from 'src/entities/PlanCharts';
import { PlanChartsService } from 'src/plan-charts/plan-charts.service';
import { Users } from 'src/entities/Users';
import { PushNotifications } from 'src/entities/PushNotifications';
import { SchedulesService } from 'src/schedules/schedules.service';
import { Schedules } from 'src/entities/Schedules';

@Module({
  imports: [
    NestScheduleModule.forRoot(),
    TypeOrmModule.forFeature([PlanCharts, Plans, SubPlans, Users, PushNotifications, Schedules]),
  ],
  providers: [BatchService, FcmService, PlansService, PlanChartsService, SchedulesService],
  controllers: [BatchController],
})
export class BatchModule {}
