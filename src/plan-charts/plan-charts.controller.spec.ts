import { Test, TestingModule } from '@nestjs/testing';
import { PlanChartsController } from './plans-charts.controller';

describe('PlanChartsController', () => {
  let controller: PlanChartsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlanChartsController],
    }).compile();

    controller = module.get<PlanChartsController>(PlanChartsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
