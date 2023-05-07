import { IsEmail, IsNotEmpty, IsString, Length, Matches } from 'class-validator';
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

  @IsEmail({}, { message: '이메일 형식을 확인해주세요.' })
  @IsNotEmpty({ message: '이메일 형식을 확인해주세요.' })
  @Column('varchar', { name: 'email', unique: true, length: 320 })
  email: string;

  @IsString({ message: '닉네임은 한글 또는 영문 2~12자로 입력해주세요.' })
  @IsNotEmpty({ message: '닉네임은 한글 또는 영문 2~12자로 입력해주세요.' })
  @Length(2, 12, { message: '닉네임은 한글 또는 영문 2~12자로 입력해주세요.' })
  @Column('varchar', { name: 'nickname', length: 100, nullable: false })
  nickname: string;

  @Column('varchar', { name: 'password', length: 100, select: false })
  @IsNotEmpty({ message: '비밀번호를 입력해주세요.' })
  @Length(8, 20, {
    message: '비밀번호는 숫자, 문자, 특수문자 조합 8~20자로 입력해주세요',
  })
  @IsString({
    message: '비밀번호는 숫자, 문자, 특수문자 조합 8~20자로 입력해주세요',
  })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/, {
    message: '비밀번호는 숫자, 문자, 특수문자 조합 8~20자로 입력해주세요',
  })
  password: string;

  @Column('tinyint', { name: 'is_certified', width: 1, default: () => "'0'" })
  isCertified: boolean;

  @Column('tinyint', { name: 'enabled', width: 1, default: () => "'1'" })
  enabled: boolean;

  // @Column('datetime', {
  //   name: 'created_at',
  //   default: () => 'CURRENT_TIMESTAMP',
  // })
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date | null;

  @DeleteDateColumn({ name: 'removed_at' })
  removedAt: Date | null;

  @OneToMany(() => PlanCharts, (planChart) => planChart.User)
  PlanCharts: PlanCharts;
}
