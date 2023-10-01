import {
  ArrayNotEmpty,
  IsArray,
  IsIn,
  IsJSON,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
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
import { OmitType, PickType } from '@nestjs/swagger';
import { invalidErrorMessage } from 'src/common/helper/invalidErrorMessage';

@Index('user_id', ['UserId'], {})
@Entity('PLAN_CHARTS', { schema: 'plem' })
export class PlanCharts {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'user_id' })
  UserId: number;

  @IsString({ message: '일정표명은 1~20자로 입력해주세요' })
  @IsNotEmpty({ message: '일정표명은 1~20자로 입력해주세요' })
  @Length(1, 20, { message: '일정표명은 1~20자로 입력해주세요' })
  @Column('varchar', { name: 'name', length: 100 })
  name: string;

  @IsNotEmpty({ message: '반복 값이 없습니다.' })
  @IsArray()
  @ArrayNotEmpty({ message: '반복 값이 없습니다.' })
  @Column('varchar', { name: 'repeats', length: 100 })
  repeats: string;

  @Column('varchar', { name: 'repeatDays', length: 200 })
  repeatDays: string;

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
