import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Goals } from 'src/entities/Goals';
import { SubPlanHistoriesService } from 'src/sub-plan-histories/sub-plan-histories.service';
import { Repository } from 'typeorm';
import { CreateGoalsDto } from './dto/create-goals.dto';

@Injectable()
export class GoalsService {
  constructor(
    @InjectRepository(Goals) private goalsRepository: Repository<Goals>,
    private subPlanHistoriesService: SubPlanHistoriesService
  ) {}

  async addGoal(body: CreateGoalsDto) {
    const goal = new Goals();
    goal.title = body.title;
    goal.id = body.id;
    goal.goalCount = body.goalCount;
    return await this.goalsRepository.save(goal);
  }

  async getGoalStatusList({ userId }: { userId: number }) {
    const goals = await this.getGoals();
    const achievementData = await Promise.all([
      this.subPlanHistoriesService.getSubPlanRankingTop({ userId }),
      this.subPlanHistoriesService.getAchievedList({ userId }),
    ]);
    const topSubPlan = achievementData[0];
    const achievedList = achievementData[1];

    // 각 목표별 달성횟수 조회
    const getAchievementInfo = (goalId: number) => {
      switch (goalId) {
        case 1: // 동일 할일을 7번 달성
        case 2: // 동일 할일을 30번 달성
        case 3: // 동일 할일을 100번 달성
        case 4: // 동일 할일을 200번 달성
        case 5: // 동일 할일을 300번 달성
        case 6: // 동일 할일을 365번 달성
        case 7: // 동일 할일을 1000번 달성
          return topSubPlan;
        case 8: // 20개의 할 일을 한 번씩 달성
        case 9: // 50개의 할 일을 한 번씩 달성
          return { count: achievedList.length };
        case 10: // 20개의 할 일을 한 번씩 달성
        case 11: // 50개의 할 일을 한 번씩 달성
          return { count: achievedList.length };
        default:
          throw new InternalServerErrorException('존재하지 않는 목표입니다.');
      }
    };

    const goalStatusList = goals.map((goal) => {
      const achivementInfo = getAchievementInfo(goal.id);
      return {
        id: goal.id,
        title: goal.title,
        achievementCount: achivementInfo.count,
        goalCount: goal.goalCount,
      };
    });

    return goalStatusList;
  }

  async getGoals() {
    return await this.goalsRepository.find();
  }
}
