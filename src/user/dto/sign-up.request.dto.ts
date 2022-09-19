import { PickType } from '@nestjs/swagger';
import { User } from 'src/entities/User';

export class SignUpRequestDto extends PickType(User, [
  'email',
  'nickname',
  'password',
] as const) {}
