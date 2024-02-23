import { IsNotEmpty, IsString, Length, IsIn } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Users } from './Users';

@Index('id', ['id'], {})
@Entity('inquiries', { schema: 'plem' })
export class Inquiries {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'user_id' })
  UserId: number;

  @IsString()
  @IsIn(['account', 'function', 'bug', 'proposal', 'etc'], { message: '문의 유형을 선택해주세요.' })
  @IsNotEmpty({ message: '문의 유형을 선택해주세요.' })
  @Length(1, 100, { message: '문의 유형을 선택해주세요.' })
  @Column('varchar', { name: 'type', length: 100 })
  type: 'account' | 'function' | 'bug' | 'proposal' | 'etc';

  @IsString()
  @IsNotEmpty({ message: '이메일을 입력해주세요.' })
  @Length(1, 100, { message: '이메일을 입력해주세요.' })
  @Column('varchar', { name: 'email', length: 100 })
  email: string;

  @IsString()
  @IsNotEmpty({ message: '제목을 입력해주세요.' })
  @Length(1, 100, { message: '제목을 입력해주세요.' })
  @Column('varchar', { name: 'title', length: 100 })
  title: string;

  @IsString()
  @IsNotEmpty({ message: '문의 내용을 입력해주세요.' })
  @Length(1, 1000, { message: '1~1000 글자 내로 입력해주세요.' })
  @Column('varchar', { name: 'content', length: 1000 })
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date | null;

  @DeleteDateColumn({ name: 'removed_at' })
  removedAt: Date | null;

  @ManyToOne(() => Users, (users) => users.PushNotifications, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  User: Users;
}
