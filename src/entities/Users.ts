import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';
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
import { PlanCharts } from './PlanCharts';

@Index('email', ['email'], { unique: true })
@Entity('USERS', { schema: 'plem' })
export class Users {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' }) // name: db 컬럼명
  id: number; // js단에서 사용할 변수명

  @IsEmail()
  @IsNotEmpty()
  @Column('varchar', { name: 'email', unique: true, length: 320 })
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 12)
  @Column('varchar', { name: 'nickname', length: 100 })
  nickname: string;

  @IsNotEmpty()
  @Length(8, 20)
  @Column('varchar', { name: 'password', length: 100, select: false })
  @IsString()
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/)
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

  @OneToMany(() => PlanCharts, (planChart) => planChart.User)
  PlanCharts: PlanCharts;
}
