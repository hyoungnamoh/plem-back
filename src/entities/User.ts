import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PlanChart } from './PlanChart';

@Index('email', ['email'], { unique: true })
@Entity('USER', { schema: 'plem' })
export class User {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' }) // name: db 컬럼명
  id: number; // js단에서 사용할 변수명

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

  // @Column('datetime', {
  //   name: 'created_at',
  //   default: () => 'CURRENT_TIMESTAMP',
  // })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // @Column('datetime', { name: 'updated_at', nullable: true })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date | null;

  // @Column('datetime', { name: 'deleted_at', nullable: true })
  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date | null;

  @OneToMany(() => PlanChart, (planChart) => planChart.User)
  PlanCharts: PlanChart[];
}
