import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Plan } from 'src/entities/Plan';
import { User } from 'src/entities/User';
import { PlanController } from './plan.controller';
import { PlanService } from './plan.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Plan])],
  providers: [PlanService],
  controllers: [PlanController],
})
export class PlanModule {}
