import { PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Length, Matches } from 'class-validator';
import { Users } from 'src/entities/Users';
import { Column } from 'typeorm';

// 정보 수정할 때 수정 api 하나로 쓸 건지 비번 / 정보 수정 api 나눌 건지
export class ChangeMyInfoRequestDto extends PickType(Users, ['password', 'nickname'] as const) {
  @IsNotEmpty()
  @Length(8, 20)
  @Column('varchar', { name: 'password', length: 100, select: false })
  @IsString()
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/)
  @IsOptional()
  newPassword: string;
}
