import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';

@Controller('plan')
export class PlanController {
  @Get(':id')
  getPlan(@Query() query, @Param() param) {
    // 특정 플랜 가져오기
    console.log('query', query);
    console.log('param', param);
  }
  @Post()
  postPlan(@Body() data) {} // 플랜 생성
}
