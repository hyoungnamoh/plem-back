import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanCharts } from 'src/entities/PlanCharts';
import { Plans } from 'src/entities/Plans';
import { PushNotifications } from 'src/entities/PushNotifications';
import { SubPlanHistories } from 'src/entities/SubPlanHistories';
import { SubPlans } from 'src/entities/SubPlans';
import { Users } from 'src/entities/Users';
import { PlanChartsModule } from 'src/plan-charts/plan-charts.module';
import { PlanChartsService } from 'src/plan-charts/plan-charts.service';
import { SubPlanHistoriesService } from 'src/sub-plan-histories/sub-plan-histories.service';
import { PlansController } from './plans.controller';
import { PlansService } from './plans.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, SubPlans, PlanCharts, Plans, PushNotifications, SubPlanHistories]),
    forwardRef(() => PlanChartsModule),
  ],
  providers: [PlansService, PlanChartsService, SubPlanHistoriesService],
  controllers: [PlansController],
})
export class PlansModule {}
