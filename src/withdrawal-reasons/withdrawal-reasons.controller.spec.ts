import { Test, TestingModule } from '@nestjs/testing';
import { WithdrawalReasonsController } from './withdrawal-reasons.controller';

describe('WithdrawalReasonsController', () => {
  let controller: WithdrawalReasonsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WithdrawalReasonsController],
    }).compile();

    controller = module.get<WithdrawalReasonsController>(WithdrawalReasonsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
