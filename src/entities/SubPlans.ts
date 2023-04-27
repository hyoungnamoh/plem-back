import { IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
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

  @Column('int', { name: 'plan_id', nullable: false })
  @IsNumber(undefined, { each: true })
  @IsNotEmpty()
  PlanId: number;

  @IsString()
  @IsNotEmpty()
  @Length(1, 30, { message: '하위 일정명을 적어주세요' })
  @Column('varchar', { name: 'name', length: 100, nullable: false })
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

  @DeleteDateColumn({ name: 'removed_at' })
  removedAt: Date | null;

  @ManyToOne(() => Plans, (plans) => plans.subPlans, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'plan_id', referencedColumnName: 'id' }])
  plan: Plans;
}
