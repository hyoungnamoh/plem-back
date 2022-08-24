import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlanController } from './plan/plan.controller';
import { PlanService } from './plan/plan.service';
import { PlanModule } from './plan/plan.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PlanModule, UserModule],
  controllers: [AppController, PlanController],
  providers: [AppService, ConfigService, PlanService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
