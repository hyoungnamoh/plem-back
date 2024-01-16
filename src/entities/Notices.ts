import { IsNotEmpty, IsString, Length } from 'class-validator';
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
@Entity('notices', { schema: 'plem' })
export class Notices {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @IsString()
  @IsNotEmpty({ message: '공지사항 제목을 입력해주세요.' })
  @Length(1, 200, { message: '공지사항 제목을 입력해주세요.' })
  @Column('varchar', { name: 'name', length: 200 })
  title: string;

  // @IsNotEmpty({ message: '이미지를 첨부해주세요.' })
  @Column('text', { name: 'contents' })
  contents: string;

  @Column('int', { name: 'view_count', default: 0, nullable: false })
  viewCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date | null;

  @DeleteDateColumn({ name: 'removed_at' })
  removedAt: Date | null;
}
