import { Test, TestingModule } from '@nestjs/testing';
import { EditionService } from './editions.service';

describe('EditionsService', () => {
  let service: EditionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EditionService],
    }).compile();

    service = module.get<EditionService>(EditionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
