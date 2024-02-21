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
import { UpdatePlanChartDto } from './dto/update-plan-chart.dto';

@Controller('plan-charts')
@UseInterceptors(SuccessResponseInterceptor)
export class PlanChartsController {
  constructor(private planChartService: PlanChartsService) {}

  // 계획표 생성
  @Post('')
  @UseGuards(JwtAuthGuard)
  async postPlanChart(@Body() body: CreatePlanChartDto, @UserDeco() user: Users) {
    return await this.planChartService.postPlanChart(Object.assign(body, { userId: user.id }));
  }

  // 오늘 계획표 가져오기
  @Get('/today')
  @UseGuards(JwtAuthGuard)
  getTodayPlanChart(@UserDeco() user: Users) {
    return this.planChartService.getTodayPlanChart(user);
  }

  // 계획표 갯수 가져오기
  @Get('/count')
  @UseGuards(JwtAuthGuard)
  getPlanChartsCount(@Query() query: { page: number }, @UserDeco() user: Users) {
    return this.planChartService.getPlanChartsCount({ ...query, userId: user.id });
  }

  // 계획표 가져오기
  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  getPlanChart(@Param() param: { id: number }, @UserDeco() user: Users) {
    return this.planChartService.getPlanChart(param, user);
  }

  // 계획표 수정
  @Put('/:id')
  @UseGuards(JwtAuthGuard)
  updatePlanChart(@Param() param: { id: number }, @Body() body: UpdatePlanChartDto, @UserDeco() user: Users) {
    return this.planChartService.updatePlanChart({ ...param, ...body, userId: user.id });
  }

  // 계획표 삭제
  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async deletePlanChart(@Param() param: { id: number }) {
    return await this.planChartService.deletePlanChart({ id: param.id });
  }

  // 계획표 리스트
  @Get('')
  @UseGuards(JwtAuthGuard)
  getPlanCharts(@Query() query: { page: number }, @UserDeco() user: Users) {
    return this.planChartService.getPlanCharts({ ...query, userId: user.id });
  }

  // 계획표 리스트 순서 변경
  @Put('/order/list')
  @UseGuards(JwtAuthGuard)
  updatePlanChartsOrder(@Body() body: { chartOrders: { id: number; order: number }[] }, @UserDeco() user: Users) {
    return this.planChartService.updatePlanChartsOrder({ ...body, userId: user.id });
  }

  // 계획표 복사
  @Post('/clone')
  @UseGuards(JwtAuthGuard)
  async clonePlanChart(@Body() body: { id: number }, @UserDeco() user: Users) {
    return await this.planChartService.clonePlanChart(body, user);
  }
}
