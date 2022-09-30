import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlansController } from './plans/plans.controller';
import { PlansService } from './plans/plans.service';
import { PlansModule } from './plans/plans.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import ormconfig from 'ormconfig';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { Users } from './entities/Users';
import { AuthModule } from './auth/auth.module';
import { Plans } from './entities/Plans';
import { PlanChartsModule } from './plan-charts/plan-charts.module';
import { PlanChartsService } from './plan-charts/plan-charts.service';
import { PlanCharts } from './entities/PlanCharts';
import { PlanChartsController } from './plan-charts/plans-charts.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PlansModule,
    UsersModule,
    TypeOrmModule.forRoot(ormconfig),
    TypeOrmModule.forFeature([Users, Plans, PlanCharts]),
    AuthModule,
    PlanChartsModule,
  ],
  controllers: [
    AppController,
    PlansController,
    UsersController,
    PlanChartsController,
  ],
  providers: [
    AppService,
    ConfigService,
    PlansService,
    UsersService,
    PlanChartsService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
