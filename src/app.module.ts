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
import configEmail from './config/email';
import { MailerModule } from '@nestjs-modules/mailer';
import * as path from 'path';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { EmailModule } from './email/email.module';
import { SubPlans } from './entities/SubPlans';
import { SubPlansService } from './sub-plans/sub-plans.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configEmail] }),
    PlansModule,
    UsersModule,
    TypeOrmModule.forRoot(ormconfig),
    TypeOrmModule.forFeature([Users, Plans, PlanCharts, SubPlans]),
    AuthModule,
    PlanChartsModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          ...config.get('email'),
          template: {
            dir: path.join(__dirname, '/templates/'),
            adapter: new EjsAdapter(),
            options: {
              strict: true,
            },
          },
        };
      },
    }),
    EmailModule,
  ],
  controllers: [AppController, PlansController, UsersController, PlanChartsController],
  providers: [AppService, ConfigService, PlansService, UsersService, PlanChartsService, SubPlansService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
