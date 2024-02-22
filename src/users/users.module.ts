import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { EmailModule } from 'src/email/email.module';
import { PushNotifications } from 'src/entities/PushNotifications';
import { Users } from 'src/entities/Users';
import { WithdrwalReasons } from 'src/entities/WithdrwalReasons';
import { PushNotificationsService } from 'src/push-notifications/push-notifications.service';
import { WithdrawalReasonsService } from 'src/withdrawal-reasons/withdrawal-reasons.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([Users, PushNotifications, WithdrwalReasons]), EmailModule],
  providers: [UsersService, AuthService, JwtService, PushNotificationsService, WithdrawalReasonsService],
  controllers: [UsersController],
})
export class UsersModule {}
