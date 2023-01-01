import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Plans } from 'src/entities/Plans';
import { SubPlans } from 'src/entities/SubPlans';
import { Users } from 'src/entities/Users';
import { PlansController } from './plans.controller';
import { PlansService } from './plans.service';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Plans, SubPlans])],
  providers: [PlansService],
  controllers: [PlansController],
})
export class PlansModule {}
