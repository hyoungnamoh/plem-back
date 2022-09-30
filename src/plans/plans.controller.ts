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
import { CreatePlanDto } from './dto/create-plan.dto';
import { PlansService } from './plans.service';

@Controller('/plans')
export class PlansController {
  constructor(private planService: PlansService) {}
  // 일정 생성
  @Post()
  postPlan(@Body() body: CreatePlanDto) {
    this.planService.postPlan(body);
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
  deletePlan(@Param() param) {}

  // 일정 리스트
  @Get('/list')
  getPlanList(@Query() query) {}
}
