import { Test, TestingModule } from '@nestjs/testing';
import { SubPlanHistoriesService } from './sub-plan-histories.service';

describe('SubPlanHistoriesService', () => {
  let service: SubPlanHistoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubPlanHistoriesService],
    }).compile();

    service = module.get<SubPlanHistoriesService>(SubPlanHistoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
