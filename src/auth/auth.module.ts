import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entities/Users';
import { UsersService } from 'src/users/users.service';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { PushNotifications } from 'src/entities/PushNotifications';
import { PushNotificationsService } from 'src/push-notifications/push-notifications.service';

@Module({
  imports: [
    PassportModule.register({ session: false }),
    JwtModule.register({
      secret: process.env.SECRET,
      signOptions: { expiresIn: process.env.ACCESS_EXPIRES_IN },
    }),
    TypeOrmModule.forFeature([Users, PushNotifications]),
  ],
  providers: [AuthService, UsersService, JwtStrategy, LocalStrategy, PushNotificationsService],
  exports: [JwtModule, AuthService, PushNotificationsService],
})
export class AuthModule {}
