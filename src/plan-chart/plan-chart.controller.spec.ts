import { Test, TestingModule } from '@nestjs/testing';
import { PlanChartController } from './plan-chart.controller';

describe('PlanChartController', () => {
  let controller: PlanChartController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlanChartController],
    }).compile();

    controller = module.get<PlanChartController>(PlanChartController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
