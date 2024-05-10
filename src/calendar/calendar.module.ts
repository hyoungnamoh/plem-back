import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { Users } from 'src/entities/Users';
import { WithdrwalReasons } from 'src/entities/WithdrwalReasons';
import { UsersService } from 'src/users/users.service';
import { WithdrawalReasonsService } from 'src/withdrawal-reasons/withdrawal-reasons.service';
import { CalendarController } from './calendar.controller';
import { CalendarService } from './calendar.service';
import { HttpModule } from '@nestjs/axios';
import { Holidays } from 'src/entities/Holidays';

@Module({
  controllers: [CalendarController],
  providers: [CalendarService, UsersService, AuthService, WithdrawalReasonsService, JwtService],
  imports: [TypeOrmModule.forFeature([Users, WithdrwalReasons, Holidays]), HttpModule],
})
export class CalendarModule {}
