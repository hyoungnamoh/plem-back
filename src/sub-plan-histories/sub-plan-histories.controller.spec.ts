import { Test, TestingModule } from '@nestjs/testing';
import { SubPlanHistoriesController } from './sub-plan-histories.controller';

describe('SubPlanHistoriesController', () => {
  let controller: SubPlanHistoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubPlanHistoriesController],
    }).compile();

    controller = module.get<SubPlanHistoriesController>(SubPlanHistoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
