import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { PushNotifications } from 'src/entities/PushNotifications';
import { Users } from 'src/entities/Users';
import { PushNotificationsService } from 'src/push-notifications/push-notifications.service';
import { UsersService } from 'src/users/users.service';
import { EmailService } from './email.service';

@Module({
  imports: [TypeOrmModule.forFeature([Users, PushNotifications])],
  providers: [EmailService, UsersService, AuthService, JwtService, PushNotificationsService],
  exports: [EmailService],
})
export class EmailModule {}
