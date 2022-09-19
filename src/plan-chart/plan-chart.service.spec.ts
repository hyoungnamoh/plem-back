import { Test, TestingModule } from '@nestjs/testing';
import { PlanChartService } from './plan-chart.service';

describe('PlanChartService', () => {
  let service: PlanChartService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlanChartService],
    }).compile();

    service = module.get<PlanChartService>(PlanChartService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
