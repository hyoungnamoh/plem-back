import { IsNotEmpty, IsString, Length } from 'class-validator';
import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('sub_plan_name', ['subPlanName'], { unique: true })
@Entity('sub_plan_histories', { schema: 'plem' })
export class SubPlanHistories {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @IsString()
  @IsNotEmpty()
  @Length(1, 30, { message: '잘못된 하위 계획명입니다.' })
  @Column('varchar', { name: 'sub_plan_name', length: 100, nullable: false })
  subPlanName: string;

  @CreateDateColumn()
  createdAt: Date;
}
