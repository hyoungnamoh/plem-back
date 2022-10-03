import { ArrayNotEmpty, IsArray, IsIn, IsNotEmpty, IsString, Length } from 'class-validator';
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
import { Users } from './Users';
import { Plans } from './Plans';

@Index('user_id', ['UserId'], {})
@Entity('PLAN_CHARTS', { schema: 'plem' })
export class PlanCharts {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'user_id', nullable: true })
  UserId: number | null;

  @IsString({ message: '일정표명은 1~20자로 입력해주세요' })
  @IsNotEmpty({ message: '일정표명은 1~20자로 입력해주세요' })
  @Length(1, 20, { message: '일정표명은 1~20자로 입력해주세요' })
  @Column('varchar', { name: 'name', length: 100 })
  name: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date | null;

  @IsArray()
  @ArrayNotEmpty()
  @OneToMany(() => Plans, (plan) => plan.PlanChart)
  Plans: Plans[];

  @ManyToOne(() => Users, (users) => users.PlanCharts, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  User: Users;
}
