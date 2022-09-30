import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Plans } from 'src/entities/Plans';
import { Users } from 'src/entities/Users';
import { PlansController } from './plans.controller';
import { PlansService } from './plans.service';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Plans])],
  providers: [PlansService],
  controllers: [PlansController],
})
export class PlansModule {}
