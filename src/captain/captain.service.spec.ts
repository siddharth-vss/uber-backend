import { Test, TestingModule } from '@nestjs/testing';
import { CaptainService } from './captain.service';

describe('CaptainService', () => {
  let service: CaptainService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CaptainService],
    }).compile();

    service = module.get<CaptainService>(CaptainService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
