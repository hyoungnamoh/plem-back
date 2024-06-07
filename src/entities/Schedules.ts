import { IsIn, IsNotEmpty, IsNumber, IsString, Length, MaxLength } from 'class-validator';
import { invalidErrorMessage } from 'src/common/helper/invalidErrorMessage';
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
import { Users } from './Users';

@Index('id', ['id'], {})
@Entity('schedules', { schema: 'plem' })
export class Schedules {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'user_id', nullable: false })
  UserId: number;

  @IsString()
  @IsNotEmpty()
  @Length(1, 30, { message: '일정명을 적어주세요.' })
  @Column('varchar', { name: 'name', length: 100 })
  name: string;

  @IsNumber({}, { message: invalidErrorMessage })
  @Column('int', { name: 'category' })
  category: number;

  @Column('timestamp', { name: 'start_date', nullable: false })
  startDate: string;

  @Column('timestamp', { name: 'end_date', nullable: false })
  endDate: string;

  @IsIn([null, '0', '5', '10', '15', '30', '60'], { message: invalidErrorMessage })
  @Column('varchar', { name: 'notification', length: 100, nullable: true })
  notification: string | null;

  @IsIn([null, 'every', 'week', 'twoWeeks', 'month', 'year', 'custom'], { message: invalidErrorMessage })
  @Column('varchar', { name: 'repeats', length: 100, nullable: true })
  repeats: string | null;

  @Column('varchar', { name: 'repeat_end_date', length: 100, nullable: true })
  repeatEndDate: string | null;

  // @Length(0, 200, { message: '메모는 최대 200자까지 입력 가능합니다.' })
  @Column('varchar', { name: 'memo', length: 400, default: '' })
  memo: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true, default: null })
  updatedAt: Date | null;

  @DeleteDateColumn({ type: 'timestamp', name: 'removed_at' })
  removedAt: Date | null;

  @ManyToOne(() => Users, (users) => users.Schedules, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  User: Users;
}
