import { Test, TestingModule } from '@nestjs/testing';
import { WithdrawalReasonsService } from './withdrawal-reasons.service';

describe('WithdrawalReasonsService', () => {
  let service: WithdrawalReasonsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WithdrawalReasonsService],
    }).compile();

    service = module.get<WithdrawalReasonsService>(WithdrawalReasonsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
