import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Holidays } from 'src/entities/Holidays';

@Module({
  imports: [TypeOrmModule.forFeature([Holidays])],
})
export class SchedulesModule {}
