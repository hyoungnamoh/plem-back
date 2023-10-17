import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseInterceptors } from '@nestjs/common';
import { SuccessResponseInterceptor } from 'src/common/interceptors/successResponse.interceptor';
import { CreatePlanDto } from './dto/create-plan.dto';
import { PlansService } from './plans.service';

@Controller('/plans')
@UseInterceptors(SuccessResponseInterceptor)
export class PlansController {
  constructor(private planService: PlansService) {}
  // 계획 생성
  @Post()
  async postPlan(@Body() body: CreatePlanDto) {
    await this.planService.postPlan(body);
  }

  // 계획 가져오기
  @Get('/:id')
  getPlan(@Param('id') id: number) {
    return this.planService.getPlan({ id });
  }

  // 계획 수정
  @Put('/:id')
  putPlan(@Param() param) {}

  // 계획 삭제
  @Delete('/:id')
  async deletePlan(@Param('id', ParseIntPipe) id: number) {
    await this.planService.deletePlan({ id });
  }

  // 계획 리스트
  @Get('')
  getPlanList(@Query() query) {}
}
