import { OmitType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsDate, IsIn, IsNotEmpty, IsNumber, IsString, Length, ValidateNested } from 'class-validator';
import { invalidErrorMessage } from 'src/common/helper/invalidErrorMessage';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PlanCharts } from './PlanCharts';
import { SubPlans } from './SubPlans';

@Index('schedule_id', ['ScheduleId'], {})
@Entity('SCHEDULES', { schema: 'plem' })
export class Schedules {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'schedule_id', nullable: false })
  @IsNotEmpty()
  ScheduleId: number;

  @IsString()
  @IsNotEmpty()
  @Length(1, 30, { message: '일정명을 적어주세요.' })
  @Column('varchar', { name: 'name', length: 100 })
  name: string;

  @IsNumber({}, { message: invalidErrorMessage })
  @Column('int', { name: 'category' })
  category: number;

  @IsDate({ message: invalidErrorMessage })
  @Column('datetime', { name: 'start_date' })
  startDate: Date;

  @IsDate({ message: invalidErrorMessage })
  @Column('datetime', { name: 'end_date' })
  endDate: Date;

  @IsIn([null, '0', '5', '10', '15', '30', '60'], { message: invalidErrorMessage })
  @Column('varchar', { name: 'notification', length: 100, nullable: true })
  notification: number | null;

  @IsNotEmpty({ message: '반복 값이 없습니다.' })
  @IsIn([null, 'everyDay', 'everyWeek', 'every2Weeks', 'everyMonth', 'everyYear'], { message: invalidErrorMessage })
  @Column('varchar', { name: 'repeats', length: 100, nullable: true })
  repeats: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn({ nullable: true, default: null })
  updatedAt: Date | null;

  @DeleteDateColumn({ name: 'removed_at' })
  removedAt: Date | null;
}
