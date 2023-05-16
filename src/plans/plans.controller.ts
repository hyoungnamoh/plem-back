import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseInterceptors } from '@nestjs/common';
import { SuccessResponseInterceptor } from 'src/common/interceptors/successResponse.interceptor';
import { CreatePlanDto } from './dto/create-plan.dto';
import { PlansService } from './plans.service';

@Controller('/plans')
@UseInterceptors(SuccessResponseInterceptor)
export class PlansController {
  constructor(private planService: PlansService) {}
  // 일정 생성
  @Post()
  async postPlan(@Body() body: CreatePlanDto) {
    await this.planService.postPlan(body);
  }

  // 일정 가져오기
  @Get('/:id')
  getPlan(@Param('id') id: number) {
    return this.planService.getPlan({ id });
  }

  // 일정 수정
  @Put('/:id')
  putPlan(@Param() param) {}

  // 일정 삭제
  @Delete('/:id')
  async deletePlan(@Param('id', ParseIntPipe) id: number) {
    await this.planService.deletePlan({ id });
  }

  // 일정 리스트
  @Get('')
  getPlanList(@Query() query) {}
}
