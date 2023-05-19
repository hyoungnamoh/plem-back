import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { Users } from 'src/entities/Users';
import { UsersService } from 'src/users/users.service';
import { EmailService } from './email.service';

@Module({
  imports: [TypeOrmModule.forFeature([Users])],
  providers: [EmailService, UsersService, AuthService, JwtService],
  exports: [EmailService],
})
export class EmailModule {}
