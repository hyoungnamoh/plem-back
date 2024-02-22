import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { PushNotifications } from 'src/entities/PushNotifications';
import { Users } from 'src/entities/Users';
import { WithdrwalReasons } from 'src/entities/WithdrwalReasons';
import { PushNotificationsService } from 'src/push-notifications/push-notifications.service';
import { UsersService } from 'src/users/users.service';
import { WithdrawalReasonsService } from 'src/withdrawal-reasons/withdrawal-reasons.service';
import { EmailService } from './email.service';

@Module({
  imports: [TypeOrmModule.forFeature([Users, PushNotifications, WithdrwalReasons])],
  providers: [EmailService, UsersService, AuthService, JwtService, PushNotificationsService, WithdrawalReasonsService],
  exports: [EmailService],
})
export class EmailModule {}
