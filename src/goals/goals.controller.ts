import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserDeco } from 'src/common/decorators/user.decorator';
import { Users } from 'src/entities/Users';
import { CreateGoalsDto } from './dto/create-goals.dto';
import { GoalsService } from './goals.service';

@Controller('goals')
export class GoalsController {
  constructor(private goalsService: GoalsService) {}

  @Post('')
  @UseGuards(JwtAuthGuard)
  async addGoal(@Body() body: CreateGoalsDto) {
    return await this.goalsService.addGoal(body);
  }

  // 달성 현황 조회
  @Get('/goalStatusList')
  @UseGuards(JwtAuthGuard)
  async getGoalStatusList(@UserDeco() user: Users) {
    return await this.goalsService.getGoalStatusList({ userId: user.id });
  }
}
