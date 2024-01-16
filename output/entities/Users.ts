import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PlanCharts } from './PlanCharts';

@Index('email', ['email'], { unique: true })
@Entity('users', { schema: 'plem' })
export class Users {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'email', unique: true, length: 320 })
  email: string;

  @Column('varchar', { name: 'nickname', length: 100 })
  nickname: string;

  @Column('varchar', { name: 'password', length: 100 })
  password: string;

  @Column('tinyint', { name: 'is_certified', width: 1, default: () => "'0'" })
  isCertified: boolean;

  @Column('tinyint', { name: 'enabled', width: 1, default: () => "'1'" })
  enabled: boolean;

  @Column('datetime', {
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column('datetime', { name: 'updated_at', nullable: true })
  updatedAt: Date | null;

  @Column('datetime', { name: 'deleted_at', nullable: true })
  deletedAt: Date | null;

  @OneToMany(() => PlanCharts, (planCharts) => planCharts.user)
  planCharts: PlanCharts[];
}
