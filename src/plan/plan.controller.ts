import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';

@Controller('/plan')
export class PlanController {
  // 일정 생성
  @Post()
  postPlan(@Body() data) {}

  // 일정 가져오기
  @Get('/:id')
  getPlan(@Param() param) {}

  // 일정 수정
  @Put('/:id')
  putPlan(@Param() param) {}

  // 일정 삭제
  @Delete('/:id')
  deletePlan(@Param() param) {}

  // 일정 리스트
  @Get('/list')
  getPlanList(@Query() query) {}

  // 일정표 생성
  @Post('/chart')
  postPlanChart(@Body() data) {}

  // 일정표 가져오기
  @Get('/chart/:id')
  getPlanChart(@Param() param) {}

  // 일정표 수정
  @Put('/chart/:id')
  putPlanChart(@Param() param) {}

  // 일정표 삭제
  @Delete('/chart/:id')
  deletePlanChart(@Param() param) {}

  // 일정표 리스트
  @Get('/chart/list')
  getPlanChartList(@Query() query) {}
}
