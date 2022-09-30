import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserDeco } from 'src/common/decorators/user.decorator';
import { Users } from 'src/entities/Users';
import { CreatePlanChartDto } from './dto/create-plan-chart.dto';
import { PlanChartsService } from './plan-charts.service';

@Controller('plan-charts')
export class PlanChartsController {
  constructor(private planChartService: PlanChartsService) {}
  // 일정표 생성
  @Post('')
  @UseGuards(JwtAuthGuard)
  postPlanChart(@Body() body: CreatePlanChartDto, @UserDeco() user: Users) {
    this.planChartService.postPlanChart(
      Object.assign(body, { userId: user.id }),
    );
  }

  // 일정표 가져오기
  @Get('/:id')
  getPlanChart(@Param() param: { id: number }) {
    return this.planChartService.getPlanChart(param);
  }

  // 일정표 수정
  @Put('/:id')
  putPlanChart(@Param() param) {}

  // 일정표 삭제
  @Delete('/:id')
  async deletePlanChart(@Body() body: { id: number }) {
    await this.planChartService.deletePlanChart(body);
  }

  // 일정표 리스트
  @Get('/list')
  getPlanChartList(@Query() query) {}
}
