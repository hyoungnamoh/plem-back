import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Plans } from './Plans';

@Index('plan_id', ['PlanId'], {})
@Entity('SUB_PLANS', { schema: 'plem' })
export class SubPlans {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'plan_id', nullable: true })
  PlanId: number | null;

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

  @ManyToOne(() => Plans, (plans) => plans.SubPlans, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'plan_id', referencedColumnName: 'id' }])
  Plan: Plans;
}
