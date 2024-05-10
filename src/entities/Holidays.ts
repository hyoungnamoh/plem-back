import { IsNotEmpty } from 'class-validator';
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
@Entity('holodays', { schema: 'plem' })
export class Holidays {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @IsNotEmpty()
  @Column('varchar', { name: 'date_kind', length: 100, nullable: false })
  dateKind: string;

  @IsNotEmpty()
  @Column('varchar', { name: 'name', length: 100, nullable: false })
  name: string;

  @IsNotEmpty()
  @Column('datetime', { name: 'date', nullable: false })
  date: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date | null;

  @DeleteDateColumn({ name: 'removed_at' })
  removedAt: Date | null;
}
