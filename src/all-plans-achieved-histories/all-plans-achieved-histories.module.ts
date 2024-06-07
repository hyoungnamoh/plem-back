import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AllPlansAchievedHistories } from 'src/entities/AllPlansAchievedHistories';
import { AllPlansAchievedHistoriesController } from './all-plans-achieved-histories.controller';
import { AllPlansAchievedHistoriesService } from './all-plans-achieved-histories.service';

@Module({
  controllers: [AllPlansAchievedHistoriesController],
  providers: [AllPlansAchievedHistoriesService],
  imports: [TypeOrmModule.forFeature([AllPlansAchievedHistories])],
})
export class AllPlansAchievedHistoriesModule {}
