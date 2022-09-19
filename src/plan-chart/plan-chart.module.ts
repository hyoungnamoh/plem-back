import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Plan } from 'src/entities/Plan';
import { PlanChart } from 'src/entities/PlanChart';
import { User } from 'src/entities/User';
import { PlanService } from 'src/plan/plan.service';
import { PlanChartController } from './plan-chart.controller';
import { PlanChartService } from './plan-chart.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, PlanChart, Plan])],
  controllers: [PlanChartController],
  providers: [PlanChartService, PlanService],
})
export class PlanChartModule {}
