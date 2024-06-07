import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import dayjs from 'dayjs';
import { AllPlansAchievedHistories } from 'src/entities/AllPlansAchievedHistories';
import { Repository } from 'typeorm';
import { CreateAllPlansAchievedHistoryDto } from './dto/create-all-plans-achieved-histories.dto';

@Injectable()
export class AllPlansAchievedHistoriesService {
  constructor(
    @InjectRepository(AllPlansAchievedHistories)
    private allPlansAchievedHistoriesRepository: Repository<AllPlansAchievedHistories>
  ) {}

  async createAllPlansAchievedHistory(body: CreateAllPlansAchievedHistoryDto & { userId: number }) {
    const currentDate = dayjs().format('YYYY-MM-DD');

    const foundHistory = await this.allPlansAchievedHistoriesRepository
      .createQueryBuilder('history')
      .where('history.UserId = :userId', {
        userId: body.userId,
      })
      .andWhere('DATE(history.date) = :date', { date: currentDate })
      .getOne();
    if (foundHistory) {
      await this.allPlansAchievedHistoriesRepository
        .createQueryBuilder('history')
        .update(AllPlansAchievedHistories)
        .set({ PlanChartId: body.PlanChartId })
        .where('id = :foundId', { foundId: foundHistory.id })
        .execute();
      return await this.allPlansAchievedHistoriesRepository
        .createQueryBuilder('history')
        .where('id = :foundId', { foundId: foundHistory.id })
        .getOne();
    }

    const history = new AllPlansAchievedHistories();
    history.PlanChartId = body.PlanChartId;
    history.UserId = body.userId;

    return await this.allPlansAchievedHistoriesRepository.save(history);
  }

  async getAllPlansAchievedHistory({ userId }: { userId: number }) {
    return await this.allPlansAchievedHistoriesRepository
      .createQueryBuilder('history')
      .where('history.UserId = :userId', { userId })
      .andWhere('history.removed_at is null')
      .getMany();
  }

  async deletellPlansAchievedHistory(param: { id: number; userId: number }) {
    const history = await this.allPlansAchievedHistoriesRepository
      .createQueryBuilder('history')
      .where('history.id = :id and user_id = :userId and removed_at is null', { id: param.id, userId: param.userId })
      .getOne();
    if (!history) {
      throw new NotFoundException('해당 기록을 찾을 수 없습니다.');
    }
    await this.allPlansAchievedHistoriesRepository.softDelete(param.id);
    return true;
  }
}
