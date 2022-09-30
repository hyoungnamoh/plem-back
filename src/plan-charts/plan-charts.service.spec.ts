import { Test, TestingModule } from '@nestjs/testing';
import { PlanChartsService } from './plan-charts.service';

describe('PlanChartsService', () => {
  let service: PlanChartsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlanChartsService],
    }).compile();

    service = module.get<PlanChartsService>(PlanChartsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
