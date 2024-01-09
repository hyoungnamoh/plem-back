import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserDeco } from 'src/common/decorators/user.decorator';
import { SuccessResponseInterceptor } from 'src/common/interceptors/successResponse.interceptor';
import { Users } from 'src/entities/Users';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { SchedulesService } from './schedules.service';

@Controller('schedules')
@UseInterceptors(SuccessResponseInterceptor)
export class SchedulesController {
  constructor(private schedulesService: SchedulesService) {}

  // 일정 만들기
  @Post('')
  @UseGuards(JwtAuthGuard)
  async postSchedule(@Body() body: CreateScheduleDto, @UserDeco() user: Users) {
    return await this.schedulesService.postSchedule(Object.assign(body, { userId: user.id }));
  }

  // 전체 일정 목록 가져오기
  @Get('')
  @UseGuards(JwtAuthGuard)
  getSchedules(@UserDeco() user: Users) {
    return this.schedulesService.getAllSchedules({ userId: user.id });
  }

  // 일정 수정 가져오기
  @Put('')
  @UseGuards(JwtAuthGuard)
  updateSchedule(@Body() body: UpdateScheduleDto, @UserDeco() user: Users) {
    return this.schedulesService.updateSchedule({ ...body, userId: user.id });
  }

  // 일정 삭제 가져오기
  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  deleteSchedule(@Param() param: { id: number }, @UserDeco() user: Users) {
    return this.schedulesService.deleteSchedule({ ...param, userId: user.id });
  }
}
