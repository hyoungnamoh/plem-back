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
import { Plan } from './entities/Plan';
import { PlanChartModule } from './plan-chart/plan-chart.module';
import { PlanChartController } from './plan-chart/plan-chart.controller';
import { PlanChartService } from './plan-chart/plan-chart.service';
import { PlanChart } from './entities/PlanChart';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PlanModule,
    UserModule,
    TypeOrmModule.forRoot(ormconfig),
    TypeOrmModule.forFeature([User, Plan, PlanChart]),
    AuthModule,
    PlanChartModule,
  ],
  controllers: [
    AppController,
    PlanController,
    UserController,
    PlanChartController,
  ],
  providers: [
    AppService,
    ConfigService,
    PlanService,
    UserService,
    PlanChartService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
