import { Body, Controller, Get, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserDeco } from 'src/common/decorators/user.decorator';
import { SuccessResponseInterceptor } from 'src/common/interceptors/successResponse.interceptor';
import { Users } from 'src/entities/Users';
import { CreateGoalsDto } from './dto/create-goals.dto';
import { GoalsService } from './goals.service';

@Controller('goals')
@UseInterceptors(SuccessResponseInterceptor)
export class GoalsController {
  constructor(private goalsService: GoalsService) {}

  @Post('')
  @UseGuards(JwtAuthGuard)
  async createGoal(@Body() body: CreateGoalsDto) {
    return await this.goalsService.createGoal(body);
  }

  // 달성 현황 조회
  @Get('/statusList')
  @UseGuards(JwtAuthGuard)
  async getGoalStatusList(@UserDeco() user: Users) {
    return await this.goalsService.getGoalStatusList({ userId: user.id });
  }
}
