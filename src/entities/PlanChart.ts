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
import { Plan } from './Plan';
import { User } from './User';

@Index('user_id', ['userId'], {})
@Entity('PLAN_CHART', { schema: 'plem' })
export class PlanChart {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'user_id', nullable: true })
  userId: number | null;

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

  @OneToMany(() => Plan, (plan) => plan.PlanChart)
  Plans: Plan[];

  @ManyToOne(() => User, (user) => user.PlanCharts, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  User: User;
}
