import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WithdrwalReasons } from 'src/entities/WithdrwalReasons';
import { WithdrawalReasonsController } from './withdrawal-reasons.controller';
import { WithdrawalReasonsService } from './withdrawal-reasons.service';

@Module({
  imports: [TypeOrmModule.forFeature([WithdrwalReasons])],
  controllers: [WithdrawalReasonsController],
  providers: [WithdrawalReasonsService],
})
export class WithdrawalReasonsModule {}
