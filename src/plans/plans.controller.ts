import { Controller, Get, UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserDeco } from 'src/common/decorators/user.decorator';
import { SuccessResponseInterceptor } from 'src/common/interceptors/successResponse.interceptor';
import { Users } from 'src/entities/Users';
import { PlansService } from './plans.service';

@Controller('/plans')
@UseInterceptors(SuccessResponseInterceptor)
export class PlansController {
  constructor(private planService: PlansService) {}
  // Do it now 가져오기
  // 위젯에서 사용, 프론트는 todayPlanChart를 가공해 사용
  @Get('/doItNow')
  @UseGuards(JwtAuthGuard)
  async getDoItNow(@UserDeco() user: Users) {
    return await this.planService.getDoItNow(user);
  }
}
