import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entities/Users';
import { UsersService } from 'src/users/users.service';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { SuccessResponseInterceptor } from 'src/common/interceptors/successResponse.interceptor';

@Module({
  imports: [
    UsersModule,
    PassportModule.register({ session: false }),
    JwtModule.register({
      secret: process.env.SECRET,
      signOptions: { expiresIn: process.env.ACCESS_EXPIRES_IN },
    }),
    TypeOrmModule.forFeature([Users]),
  ],
  providers: [
    AuthService,
    UsersService,
    JwtStrategy,
    LocalStrategy,
    // 이 접근 방식을 사용하여 인터셉터에 대한 종속성 주입을 수행할 때 이 구성이 사용되는 모듈에 관계없이 인터셉터는 실제로 전역적이라는 점에 유의하십시오.
    // https://docs.nestjs.com/interceptors
    {
      provide: APP_INTERCEPTOR,
      useClass: SuccessResponseInterceptor,
    },
  ],
  exports: [JwtModule, AuthService],
})
export class AuthModule {}
