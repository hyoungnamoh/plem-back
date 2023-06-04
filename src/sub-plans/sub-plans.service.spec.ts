import { Test, TestingModule } from '@nestjs/testing';
import { SubPlansService } from './sub-plans.service';

describe('SubPlansService', () => {
  let service: SubPlansService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubPlansService],
    }).compile();

    service = module.get<SubPlansService>(SubPlansService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
