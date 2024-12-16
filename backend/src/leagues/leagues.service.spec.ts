import { Test, TestingModule } from '@nestjs/testing';
import { LeagueService } from './leagues.service';
import { CreateLeagueDTO } from './dto/create-league.dto';

describe('LeaguesService', () => {
  let service: LeagueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LeagueService],
    }).compile();

    service = module.get<LeagueService>(LeagueService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should be able to create a new user', async () => {
    const iplDTO: CreateLeagueDTO = {
      name: 'IPL',
    };
    const ipl = await service.add(iplDTO);
    expect(ipl.name).toEqual('IPL');
  });
});
