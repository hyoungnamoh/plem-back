import { Column, DeleteDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Index('id', ['id'], { unique: true })
@Entity('all_plans_achieved_histories', { schema: 'plem' })
export class AllPlansAchievedHistories {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'plan_chart_id' })
  PlanChartId: number;

  @Column('int', { name: 'user_id' })
  UserId: number;

  @UpdateDateColumn()
  date: Date;

  @DeleteDateColumn({ name: 'removed_at' })
  removedAt: Date | null;
}
