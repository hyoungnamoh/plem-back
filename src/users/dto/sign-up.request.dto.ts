import { PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { Users } from 'src/entities/Users';
import { Column } from 'typeorm';

export class SignUpRequestDto extends PickType(Users, ['email', 'password', 'nickname'] as const) {}
