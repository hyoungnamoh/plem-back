import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Plans } from 'src/entities/Plans';
import { PlanCharts } from 'src/entities/PlanCharts';
import { Users } from 'src/entities/Users';
import { PlansService } from 'src/plans/plans.service';
import { PlanChartsController } from './plans-charts.controller';
import { PlanChartsService } from './plan-charts.service';
import { SubPlans } from 'src/entities/SubPlans';
import { SubPlansService } from 'src/sub-plans/sub-plans.service';
import { PlansModule } from 'src/plans/plans.module';
import { PushNotifications } from 'src/entities/PushNotifications';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, PlanCharts, SubPlans, Plans, PushNotifications]),
    forwardRef(() => PlansModule),
  ],
  controllers: [PlanChartsController],
  providers: [PlanChartsService, PlansService, SubPlansService],
})
export class PlanChartsModule {}
