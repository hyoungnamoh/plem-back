import { IsNotEmpty, IsString, Length, IsIn } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Index('id', ['id'], {})
@Entity('withdrawal_reasons', { schema: 'plem' })
export class WithdrwalReasons {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @IsNotEmpty({ message: '유저 아이디가 없습니다.' })
  @Column('int', { name: 'user_id', nullable: false })
  userId: number;

  @IsIn(['remove_data', 'experience', 'another_app', 'frequency', 'etc'])
  @IsNotEmpty({ message: '탈퇴 사유를 선택해주세요.' })
  @Column('varchar', { name: 'type', length: 100, nullable: false })
  type: 'account' | 'function' | 'bug' | 'proposal' | 'etc';

  @IsString()
  @Length(0, 200, { message: '200자까지 입력 가능합니다.' })
  @Column('varchar', { name: 'reason', length: 200 })
  reason: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date | null;

  @DeleteDateColumn({ name: 'removed_at' })
  removedAt: Date | null;
}
