import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlansController } from './plans/plans.controller';
import { PlansService } from './plans/plans.service';
import { PlansModule } from './plans/plans.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import ormconfig from 'src/ormconfig';
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
import { SchedulesService } from './schedules/schedules.service';
import { SchedulesModule } from './schedules/schedules.module';
import { Schedules } from './entities/Schedules';
import { SchedulesController } from './schedules/schedules.controller';
import { NoticeController } from './notices/notices.controller';
import { NoticeService } from './notices/notices.service';
import { NoticeModule } from './notices/notices.module';
import { Notices } from './entities/Notices';
import { PushNotifications } from './entities/PushNotifications';
import { PushNotificationsModule } from './push-notifications/push-notifications.module';
import { PushNotificationsController } from './push-notifications/push-notifications.controller';
import { PushNotificationsService } from './push-notifications/push-notifications.service';
import { BatchController } from './batch/batch.controller';
import { BatchModule } from './batch/batch.module';
import { FcmModule } from './fcm/fcm.module';
import { FcmController } from './fcm/fcm.controller';
import { FcmService } from './fcm/fcm.service';
import { InquiriesController } from './inquiries/inquiries.controller';
import { InquiriesModule } from './inquiries/inquiries.module';
import { InquiriesService } from './inquiries/inquiries.service';
import { Inquiries } from './entities/Inquiries';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configEmail] }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    PlansModule,
    UsersModule,
    TypeOrmModule.forRoot(ormconfig),
    TypeOrmModule.forFeature([Users, Plans, PlanCharts, SubPlans, Schedules, Notices, PushNotifications, Inquiries]),
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
    SchedulesModule,
    NoticeModule,
    PushNotificationsModule,
    BatchModule,
    FcmModule,
    InquiriesModule,
  ],
  controllers: [
    AppController,
    PlansController,
    UsersController,
    PlanChartsController,
    SchedulesController,
    NoticeController,
    PushNotificationsController,
    BatchController,
    FcmController,
    InquiriesController,
  ],
  providers: [
    AppService,
    ConfigService,
    PlansService,
    UsersService,
    PlanChartsService,
    SubPlansService,
    SchedulesService,
    NoticeService,
    PushNotificationsService,
    FcmService,
    InquiriesService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
