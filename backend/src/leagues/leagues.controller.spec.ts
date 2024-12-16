import { Test, TestingModule } from '@nestjs/testing';
import { LeaguesController } from './leagues.controller';
import {
  AddLeagueService,
  DeleteLeagueService,
  GetAllLeagueService,
  LeagueService,
} from './leagues.service';
import axios from 'axios';
import { CreateLeagueDTO } from './dto/create-league.dto';
import { NestFactory } from '@nestjs/core/nest-factory';
import { INestApplication } from '@nestjs/common/interfaces/nest-application.interface';
import { League } from './entities/league.entity';
import * as request from 'supertest';
import { LeaguesModule } from './leagues.module';

class TestLeagueService
  implements GetAllLeagueService, AddLeagueService, DeleteLeagueService
{
  private leagues: League[] = [
    // { id: 1, name: 'ipl', editions: [], createdAt: 'w' },
  ];
  getAll(): Promise<League[]> {
    return Promise.resolve(this.leagues);
  }
  add(league: CreateLeagueDTO): Promise<League> {
    const newLeague: League = new League(league);
    this.leagues = [...this.leagues, newLeague];
    return Promise.resolve<League>(newLeague);
  }

  delete(id: number): Promise<string> {
    let league = this.leagues.find((league) => league.id === id);
    this.leagues = this.leagues.filter(
      (currentLeague) => currentLeague.id !== league.id,
    );
    return Promise.resolve(`League with id: ${id} deleted`);
  }
}

describe('LeaguesController', () => {
  let app: INestApplication;
  let module: TestingModule;
  let testService = new TestLeagueService();

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [LeaguesModule],
    })
      .overrideProvider(LeagueService)
      .useValue(testService)
      .compile();

    app = module.createNestApplication();
    await app.init();
  });

  it('should be able to get all leagues', async () => {
    return await request(app.getHttpServer())
      .get('/leagues')
      .expect(200)
      .expect([]);
  });

  it('Should be able to add new league', async () => {
    return await request(app.getHttpServer())
      .post('/leagues')
      .send({ name: 'ipl' })
      .expect(201);
  });

  it('Should be able to delete new league', async () => {
    await request(app.getHttpServer()).post('/leagues').send({ name: 'ipl' });
    // request(app.getHttpServer()).get('/leagues');
    return await request(app.getHttpServer())
      .delete(`/leagues/${1}`)
      .expect(200)
      .expect('League with id: 1 deleted');
  });

  afterAll(async () => {
    await app.close();
  });
});
