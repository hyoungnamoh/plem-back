import { Test, TestingModule } from '@nestjs/testing';
import { AllPlansAchievedHistoriesService } from './all-plans-achieved-histories.service';

describe('AllPlansAchievedHistoriesService', () => {
  let service: AllPlansAchievedHistoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AllPlansAchievedHistoriesService],
    }).compile();

    service = module.get<AllPlansAchievedHistoriesService>(AllPlansAchievedHistoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
