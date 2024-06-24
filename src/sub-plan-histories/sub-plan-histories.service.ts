import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import dayjs from 'dayjs';
import { SubPlanHistories } from 'src/entities/SubPlanHistories';
import { DataSource, Repository } from 'typeorm';
import { CreateSubPlanHistoryDto } from './dto/create-sub-plan-history.dto';

@Injectable()
export class SubPlanHistoriesService {
  constructor(
    @InjectRepository(SubPlanHistories)
    private subPlanHistoryRepository: Repository<SubPlanHistories>,
    private datasource: DataSource
  ) {}

  async checkSubPlan({ subPlanName, date, UserId }: CreateSubPlanHistoryDto) {
    const startOfDate = dayjs(date).startOf('date').toDate();
    const foundSubPlanHistory = await this.getSubPlanHistory({ subPlanName, userId: UserId, date: startOfDate });
    if (foundSubPlanHistory) {
      await this.deleteSubPlanHisotry({ id: foundSubPlanHistory.id });
    } else {
      await this.postSubPlanHistory({ subPlanName, UserId, date: startOfDay });
    }
  }

  async postSubPlanHistory({ subPlanName, UserId, date }: CreateSubPlanHistoryDto) {
    const subPlanHistory = new SubPlanHistories();
    subPlanHistory.subPlanName = subPlanName;
    subPlanHistory.UserId = UserId;
    subPlanHistory.date = date;
    await this.subPlanHistoryRepository.save(subPlanHistory);
  }

  async getSubPlanHistory({ userId, subPlanName, date }: { userId: number; subPlanName: string; date: Date }) {
    const foundSubPlanHistory = await this.subPlanHistoryRepository.findOne({
      where: { subPlanName, UserId: userId, date },
    });

    return foundSubPlanHistory;
  }

  async deleteSubPlanHisotry({ id }: { id: number }) {
    await this.subPlanHistoryRepository.delete({ id });
  }

  async initSubPlanHistory({
    subPlanName,
    userId,
  }: { subPlanName: SubPlanHistories['subPlanName'] } & { userId: number }) {
    this.subPlanHistoryRepository.delete({ subPlanName, UserId: userId });
  }

  async getSubPlanRankingTop5({ userId }: { userId: number }) {
    const subPlanRankingTop5 = await this.subPlanHistoryRepository
      .createQueryBuilder('subPlanHistories')
      .select('subPlanHistories.subPlanName', 'subPlanName')
      .addSelect('COUNT(*)', 'count')
      .where('subPlanHistories.UserId = :userId', { userId })
      .groupBy('subPlanHistories.subPlanName')
      .orderBy('count', 'DESC')
      .limit(5)
      .getRawMany();

    return subPlanRankingTop5;
  }

  async getSubPlanRankingTop({ userId }: { userId: number }) {
    const subPlanRankingTop = await this.subPlanHistoryRepository
      .createQueryBuilder('subPlanHistories')
      .select('subPlanHistories.subPlanName', 'subPlanName')
      .addSelect('COUNT(*)', 'count')
      .where('subPlanHistories.UserId = :userId', { userId })
      .groupBy('subPlanHistories.subPlanName')
      .orderBy('count', 'DESC')
      .getRawOne();

    return subPlanRankingTop;
  }
}
