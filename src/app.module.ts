import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlanController } from './plan/plan.controller';
import { PlanService } from './plan/plan.service';
import { PlanModule } from './plan/plan.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import ormconfig from 'ormconfig';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { User } from './entities/User';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PlanModule,
    UserModule,
    TypeOrmModule.forRoot(ormconfig),
    TypeOrmModule.forFeature([User]),
    AuthModule,
  ],
  controllers: [AppController, PlanController, UserController],
  providers: [AppService, ConfigService, PlanService, UserService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
