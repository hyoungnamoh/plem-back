import { Injectable } from '@nestjs/common';
import { SignUpRequestDto } from './dto/sign-up.request.dto';

@Injectable()
export class UserService {
  signUp({ email, password, nickname }: SignUpRequestDto) {}
}
