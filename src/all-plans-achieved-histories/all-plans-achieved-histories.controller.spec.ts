import { Test, TestingModule } from '@nestjs/testing';
import { AllPlansAchievedHistoriesController } from './all-plans-achieved-histories.controller';

describe('AllPlansAchievedHistoriesController', () => {
  let controller: AllPlansAchievedHistoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AllPlansAchievedHistoriesController],
    }).compile();

    controller = module.get<AllPlansAchievedHistoriesController>(AllPlansAchievedHistoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
