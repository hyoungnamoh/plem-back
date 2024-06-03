import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Goals } from 'src/entities/Goals';
import { SubPlanHistories } from 'src/entities/SubPlanHistories';
import { SubPlanHistoriesService } from 'src/sub-plan-histories/sub-plan-histories.service';
import { GoalsController } from './goals.controller';
import { GoalsService } from './goals.service';

@Module({
  controllers: [GoalsController],
  providers: [GoalsService, SubPlanHistoriesService],
  imports: [TypeOrmModule.forFeature([Goals, SubPlanHistories])],
})
export class GoalsModule {}
