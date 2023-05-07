import { OmitType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsIn, IsNotEmpty, IsNumber, IsString, Length, ValidateNested } from 'class-validator';
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

@Index('plan_chart_id', ['PlanChartId'], {})
@Entity('PLANS', { schema: 'plem' })
export class Plans {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'plan_chart_id', nullable: false })
  @IsNumber(undefined, { each: true })
  @IsNotEmpty()
  PlanChartId: number;

  @IsString()
  @IsNotEmpty()
  @Length(1, 30, { message: '일정명을 적어주세요.' })
  @Column('varchar', { name: 'name', length: 100 })
  name: string;

  @IsIn([null, 0, 1, 2, 3, 4, 5, 6, 7], { message: (validationArguments) => invalidErrorMessage(validationArguments) })
  @Column('varchar', { name: 'notification', length: 100, nullable: true })
  notification: number | null;

  @IsNumber({}, { message: (validationArguments) => invalidErrorMessage(validationArguments) })
  @Column('int', { name: 'start_hour' })
  startHour: number;

  @IsNumber({}, { message: (validationArguments) => invalidErrorMessage(validationArguments) })
  @Column('int', { name: 'start_min' })
  startMin: number;

  @IsNumber({}, { message: (validationArguments) => invalidErrorMessage(validationArguments) })
  @Column('int', { name: 'end_hour' })
  endHour: number;

  @IsNumber({}, { message: (validationArguments) => invalidErrorMessage(validationArguments) })
  @Column('int', { name: 'end_min' })
  endMin: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn({ nullable: true, default: null })
  updatedAt: Date | null;

  @DeleteDateColumn({ name: 'removed_at' })
  removedAt: Date | null;

  @ManyToOne(() => PlanCharts, (planCharts) => planCharts.plans, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'plan_chart_id', referencedColumnName: 'id' }])
  PlanChart: PlanCharts;

  @IsArray()
  @OneToMany(() => SubPlans, (subPlans) => subPlans.plan)
  @ValidateNested()
  @Type(() => OmitType(SubPlans, ['PlanId']))
  subPlans: SubPlans[];
}
