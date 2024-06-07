import { IsNotEmpty, IsString } from 'class-validator';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, Index, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Index('id', ['id'], {})
@Entity('goals', { schema: 'plem' })
export class Goals {
  @PrimaryColumn({ type: 'int', name: 'id' })
  id: number;

  @IsNotEmpty()
  @IsString()
  @Column('varchar', { name: 'title', length: 200, nullable: false })
  title: string;

  @Column('int', { name: 'goal_count', nullable: false })
  goalCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date | null;

  @DeleteDateColumn()
  removedAt: Date | null;
}
