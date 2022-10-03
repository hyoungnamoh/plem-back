import { PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { Users } from 'src/entities/Users';
import { Column } from 'typeorm';

export class SignUpRequestDto extends PickType(Users, [
  'email',
  'password',
] as const) {
  @IsNotEmpty()
  @Length(8, 20)
  @Column('varchar', { name: 'password', length: 100, select: false })
  @IsString()
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/)
  checkPassword: string;
}
