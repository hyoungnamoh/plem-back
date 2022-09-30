import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Plans } from './Plans';

@Index('plan_id', ['planId'], {})
@Entity('SUB_PLANS', { schema: 'plem' })
export class SubPlans {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'plan_id', nullable: true })
  planId: number | null;

  @Column('varchar', { name: 'name', length: 100 })
  name: string;

  @Column('datetime', {
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column('datetime', { name: 'updated_at', nullable: true })
  updatedAt: Date | null;

  @ManyToOne(() => Plans, (plans) => plans.subPlans, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'plan_id', referencedColumnName: 'id' }])
  plan: Plans;
}
