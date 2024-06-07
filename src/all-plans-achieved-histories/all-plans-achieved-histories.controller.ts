import { Body, Controller, Delete, Get, Param, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserDeco } from 'src/common/decorators/user.decorator';
import { SuccessResponseInterceptor } from 'src/common/interceptors/successResponse.interceptor';
import { Users } from 'src/entities/Users';
import { AllPlansAchievedHistoriesService } from './all-plans-achieved-histories.service';
import { CreateAllPlansAchievedHistoryDto } from './dto/create-all-plans-achieved-histories.dto';

@Controller('all-plans-achieved-histories')
@UseInterceptors(SuccessResponseInterceptor)
export class AllPlansAchievedHistoriesController {
  constructor(private allPlansAchievedHistoriesService: AllPlansAchievedHistoriesService) {}

  @Post('')
  @UseGuards(JwtAuthGuard)
  async createAllPlansAchievedHistory(@Body() body: CreateAllPlansAchievedHistoryDto, @UserDeco() user: Users) {
    return this.allPlansAchievedHistoriesService.createAllPlansAchievedHistory({ ...body, userId: user.id });
  }

  @Get('')
  @UseGuards(JwtAuthGuard)
  async getAllPlansAchievedHistory(@UserDeco() user: Users) {
    return this.allPlansAchievedHistoriesService.getAllPlansAchievedHistory({ userId: user.id });
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async deletellPlansAchievedHistory(@Param() param: { id: number }, @UserDeco() user: Users) {
    return this.allPlansAchievedHistoriesService.deletellPlansAchievedHistory({ ...param, userId: user.id });
  }
}
