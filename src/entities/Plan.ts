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
import { PlanChart } from './PlanChart';
import { SubPlan } from './SubPlan';

@Index('plan_chart_id', ['planChartId'], {})
@Entity('PLAN', { schema: 'plem' })
export class Plan {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'plan_chart_id', nullable: true })
  planChartId: number | null;

  @Column('varchar', { name: 'name', length: 100 })
  name: string;

  // @Column('datetime', {
  //   name: 'created_at',
  //   default: () => 'CURRENT_TIMESTAMP',
  // })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // @Column('datetime', { name: 'updated_at', nullable: true })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date | null;

  @ManyToOne(() => PlanChart, (planChart) => planChart.Plans, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'plan_chart_id', referencedColumnName: 'id' }])
  PlanChart: PlanChart;

  @OneToMany(() => SubPlan, (subPlan) => subPlan.Plan)
  SubPlans: SubPlan[];
}