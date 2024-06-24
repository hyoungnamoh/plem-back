import { Body, Controller, Delete, Get, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserDeco } from 'src/common/decorators/user.decorator';
import { SuccessResponseInterceptor } from 'src/common/interceptors/successResponse.interceptor';
import { SubPlanHistories } from 'src/entities/SubPlanHistories';
import { Users } from 'src/entities/Users';
import { CreateSubPlanHistoryDto } from './dto/create-sub-plan-history.dto';
import { SubPlanHistoriesService } from './sub-plan-histories.service';

@Controller('sub-plan-histories')
@UseInterceptors(SuccessResponseInterceptor)
export class SubPlanHistoriesController {
  constructor(private subPlanHistoryService: SubPlanHistoriesService) {}

  @Post('')
  @UseGuards(JwtAuthGuard)
  async checkSubPlan(@Body() body: CreateSubPlanHistoryDto, @UserDeco() user: Users) {
    return await this.subPlanHistoryService.checkSubPlan(Object.assign({ ...body, UserId: user.id }));
  }

  @Delete('')
  @UseGuards(JwtAuthGuard)
  async initSubPlanHistory(@Body() body: { subPlanName: SubPlanHistories['subPlanName'] }, @UserDeco() user: Users) {
    return await this.subPlanHistoryService.initSubPlanHistory(Object.assign(body, { userId: user.id }));
  }

  @Get('ranking/top5')
  @UseGuards(JwtAuthGuard)
  async getSubPlanRankingTop5(@UserDeco() user: Users) {
    return await this.subPlanHistoryService.getSubPlanRankingTop5({ userId: user.id });
  }

  @Get('ranking/top')
  @UseGuards(JwtAuthGuard)
  async getSubPlanRankingTop(@UserDeco() user: Users) {
    return await this.subPlanHistoryService.getSubPlanRankingTop({ userId: user.id });
  }
}
