import {
  Body,
  Catch,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserDeco } from 'src/common/decorators/user.decorator';
import { SuccessResponseInterceptor } from 'src/common/interceptors/successResponse.interceptor';
import { Users } from 'src/entities/Users';
import { CreatePlanChartDto } from './dto/create-plan-chart.dto';
import { PlanChartsService } from './plan-charts.service';
import { ModifyPlanChartDto } from './dto/modify-plan-chart.dto';

@Controller('plan-charts')
@UseInterceptors(SuccessResponseInterceptor)
export class PlanChartsController {
  constructor(private planChartService: PlanChartsService) {}
  // 일정표 생성
  @Post('')
  @UseGuards(JwtAuthGuard)
  async postPlanChart(@Body() body: CreatePlanChartDto, @UserDeco() user: Users) {
    return await this.planChartService.postPlanChart(Object.assign(body, { userId: user.id }));
  }

  // 일정표 가져오기
  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  getPlanChart(@Param() param: { id: number }, @UserDeco() user: Users) {
    return this.planChartService.getPlanChart(param, user);
  }

  // 일정표 수정
  @Put('/:id')
  @UseGuards(JwtAuthGuard)
  putPlanChart(@Param() param: { id: number }, @Body() body: ModifyPlanChartDto) {
    return this.planChartService.putPlanChart({ ...param, ...body });
  }

  // 일정표 삭제
  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async deletePlanChart(@Body() body: { id: number }) {
    await this.planChartService.deletePlanChart(body);
  }

  // 일정표 리스트
  @Get('')
  @UseGuards(JwtAuthGuard)
  getPlanCharts(@Query() query: { page: number }, @UserDeco() user: Users) {
    return this.planChartService.getPlanCharts({ ...query, userId: user.id });
  }

  // 일정표 리스트 순서 변경
  @Put('/order/list')
  @UseGuards(JwtAuthGuard)
  updatePlanChartsOrder(@Body() body: { chartOrders: { id: number; order: number }[] }, @UserDeco() user: Users) {
    return this.planChartService.updatePlanChartsOrder({ ...body, userId: user.id });
  }
}
