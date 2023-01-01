import { OmitType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsNumber, IsString, Length, ValidateNested } from 'class-validator';
import {
  Column,
  CreateDateColumn,
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
  @Length(1, 30, { message: '일정명을 적어주세요' })
  @Column('varchar', { name: 'name', length: 100 })
  name: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // @Column('datetime', { name: 'updated_at', nullable: true })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date | null;

  @ManyToOne(() => PlanCharts, (planCharts) => planCharts.Plans, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'plan_chart_id', referencedColumnName: 'id' }])
  PlanChart: PlanCharts;

  @IsArray()
  @ArrayNotEmpty()
  @OneToMany(() => SubPlans, (subPlans) => subPlans.Plan)
  @ValidateNested()
  @Type(() => OmitType(SubPlans, ['PlanId']))
  SubPlans: SubPlans[];
}
