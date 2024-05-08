import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { EmailService } from 'src/email/email.service';
import { Users } from 'src/entities/Users';
import { WithdrwalReasons } from 'src/entities/WithdrwalReasons';
import { UsersService } from 'src/users/users.service';
import { WithdrawalReasonsService } from 'src/withdrawal-reasons/withdrawal-reasons.service';
import { InquiriesController } from './inquiries.controller';
import { InquiriesService } from './inquiries.service';

@Module({
  controllers: [InquiriesController],
  providers: [InquiriesService, EmailService, AuthService, UsersService, JwtService, WithdrawalReasonsService],
  imports: [TypeOrmModule.forFeature([Users, WithdrwalReasons])],
})
export class InquiriesModule {}
