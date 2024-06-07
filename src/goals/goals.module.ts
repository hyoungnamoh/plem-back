import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AllPlansAchievedHistoriesService } from 'src/all-plans-achieved-histories/all-plans-achieved-histories.service';
import { AllPlansAchievedHistories } from 'src/entities/AllPlansAchievedHistories';
import { Goals } from 'src/entities/Goals';
import { SubPlanHistories } from 'src/entities/SubPlanHistories';
import { SubPlanHistoriesService } from 'src/sub-plan-histories/sub-plan-histories.service';
import { GoalsController } from './goals.controller';
import { GoalsService } from './goals.service';

@Module({
  controllers: [GoalsController],
  providers: [GoalsService, SubPlanHistoriesService, AllPlansAchievedHistoriesService],
  imports: [TypeOrmModule.forFeature([Goals, SubPlanHistories, AllPlansAchievedHistories])],
})
export class GoalsModule {}
