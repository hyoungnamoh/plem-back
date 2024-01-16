import { ArrayNotEmpty, IsArray, IsNotEmpty, IsNumber, IsString, Length, ValidateNested } from 'class-validator';
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
import { Users } from './Users';
import { Plans } from './Plans';
import { Type } from 'class-transformer';
import { OmitType } from '@nestjs/swagger';

@Index('user_id', ['UserId'], {})
@Entity('plan_charts', { schema: 'plem' })
export class PlanCharts {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'user_id' })
  UserId: number;

  @IsString({ message: '계획표명은 1~20자로 입력해주세요' })
  @IsNotEmpty({ message: '계획표명은 1~20자로 입력해주세요' })
  @Length(1, 20, { message: '계획표명은 1~20자로 입력해주세요' })
  @Column('varchar', { name: 'name', length: 100 })
  name: string;

  // 안함 | 일 | 월 | 화 | 수 | 목 | 금 | 토 | 날짜 지정
  // null | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7
  @IsNotEmpty({ message: '반복 값이 없습니다.' })
  @IsArray()
  @ArrayNotEmpty({ message: '반복 값이 없습니다.' })
  @Column('varchar', { name: 'repeats', length: 100 })
  repeats: string;

  // 특정일 반복 ex) [1, 3, 12]
  @Column('varchar', { name: 'repeatDates', length: 200, default: '[]' })
  repeatDates: string;

  @IsNumber()
  @Column('int', { name: 'order_num' })
  orderNum: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn({ nullable: true, default: null })
  updatedAt: Date | null;

  @DeleteDateColumn({ name: 'removed_at' })
  removedAt: Date | null;

  @IsArray()
  @ArrayNotEmpty({ message: '계획이 비어있습니다.' })
  @OneToMany(() => Plans, (plan) => plan.PlanChart)
  @ValidateNested()
  @Type(() => OmitType(Plans, ['PlanChartId']))
  plans: Plans[];

  @ManyToOne(() => Users, (users) => users.PlanCharts, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  User: Users;
}
