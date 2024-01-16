import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PlanCharts } from './PlanCharts';
import { SubPlans } from './SubPlans';

@Index('plan_chart_id', ['planChartId'], {})
@Entity('plans', { schema: 'plem' })
export class Plans {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'plan_chart_id', nullable: true })
  planChartId: number | null;

  @Column('varchar', { name: 'name', length: 100 })
  name: string;

  @Column('datetime', {
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column('datetime', { name: 'updated_at', nullable: true })
  updatedAt: Date | null;

  @ManyToOne(() => PlanCharts, (planCharts) => planCharts.plans, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'plan_chart_id', referencedColumnName: 'id' }])
  planChart: PlanCharts;

  @OneToMany(() => SubPlans, (subPlans) => subPlans.plan)
  subPlans: SubPlans[];
}
