import { Test, TestingModule } from '@nestjs/testing';
import { CaptainController } from './captain.controller';

describe('CaptainController', () => {
  let controller: CaptainController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CaptainController],
    }).compile();

    controller = module.get<CaptainController>(CaptainController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
