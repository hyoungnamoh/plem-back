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
@Entity('plans', { schema: 'plem' })
export class Plans {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'plan_chart_id', nullable: false })
  @IsNumber(undefined, { each: true })
  @IsNotEmpty()
  PlanChartId: number;

  @IsString()
  @IsNotEmpty()
  @Length(1, 30, { message: '계획명을 적어주세요.' })
  @Column('varchar', { name: 'name', length: 100 })
  name: string;

  @IsIn([null, '0', '5', '10', '15', '30', '60'], { message: invalidErrorMessage })
  @Column('varchar', { name: 'notification', length: 100, nullable: true })
  notification: '0' | '5' | '10' | '15' | '30' | '60' | null;

  @IsNumber({}, { message: invalidErrorMessage })
  @Column('int', { name: 'start_hour' })
  startHour: number;

  @IsNumber({}, { message: invalidErrorMessage })
  @Column('int', { name: 'start_min' })
  startMin: number;

  @IsNumber({}, { message: invalidErrorMessage })
  @Column('int', { name: 'end_hour' })
  endHour: number;

  @IsNumber({}, { message: invalidErrorMessage })
  @Column('int', { name: 'end_min' })
  endMin: number;

  @Column('varchar', { name: 'temp_id', length: 100, nullable: false })
  tempId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn({ nullable: true, default: null })
  updatedAt: Date | null;

  @DeleteDateColumn({ name: 'removed_at' })
  removedAt: Date | null;

  @ManyToOne(() => PlanCharts, (planCharts) => planCharts.Plans, {
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
