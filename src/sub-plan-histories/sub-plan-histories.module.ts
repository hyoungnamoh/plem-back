import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubPlanHistories } from 'src/entities/SubPlanHistories';
import { SubPlanHistoriesController } from './sub-plan-histories.controller';
import { SubPlanHistoriesService } from './sub-plan-histories.service';

@Module({
  controllers: [SubPlanHistoriesController],
  providers: [SubPlanHistoriesService],
  imports: [TypeOrmModule.forFeature([SubPlanHistories])],
})
export class SubPlanHistoriesModule {}
