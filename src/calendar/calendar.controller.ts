import { Body, Controller, Get, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserDeco } from 'src/common/decorators/user.decorator';
import { SuccessResponseInterceptor } from 'src/common/interceptors/successResponse.interceptor';
import { Users } from 'src/entities/Users';
import { CalendarService } from './calendar.service';

@Controller('calendar')
@UseInterceptors(SuccessResponseInterceptor)
export class CalendarController {
  constructor(private calendarService: CalendarService) {}

  @Get('/holidays')
  @UseGuards(JwtAuthGuard)
  getHolidays(@UserDeco() user: Users, @Query('startYear') startYear: number, @Query('endYear') endYear: number) {
    return this.calendarService.getHolidays();
  }

  @Post('/holidays')
  @UseGuards(JwtAuthGuard)
  addHolidays(
    @UserDeco() user: Users,
    @Body()
    body: { startYear: number; endYear?: number }
  ) {
    return this.calendarService.addHolidays({ userId: user.id, ...body });
  }
}
