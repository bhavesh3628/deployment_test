import { Test, TestingModule } from '@nestjs/testing';
import { EditionsController } from './editions.controller';
import {
  AddEditionService,
  DeleteEditionService,
  EditEditionService,
  EditionService,
  GetAllEditionService,
} from './editions.service';
import * as request from 'supertest';

import { Edition } from './entities/edition.entity';
import { CreateEditionDTO } from './dto/create-edition.dto';
import { UpdateEditionDTO } from './dto/update-edition.dto';
import { INestApplication } from '@nestjs/common/interfaces/nest-application.interface';
import { EditionsModule } from './editions.module';
import { LeaguesModule } from 'src/leagues/leagues.module';
import { LeagueService } from 'src/leagues/leagues.service';
import { TestLeagueService } from 'src/leagues/leagues.controller.spec';

class TestEditionService
  implements
    GetAllEditionService,
    AddEditionService,
    DeleteEditionService,
    EditEditionService
{
  private editions: Edition[] = [];
  private static counter: number = 1;
  getAll(): Promise<Edition[]> {
    return Promise.resolve(this.editions);
  }
  add(edition: CreateEditionDTO): Promise<Edition> {
    edition.id = TestEditionService.counter++;
    const newEdition: Edition = new Edition(edition);
    this.editions = [...this.editions, newEdition];
    return Promise.resolve<Edition>(newEdition);
  }

  async delete(id: number): Promise<string> {
    let edition = await this.findOne(id);

    this.editions = this.editions.filter(
      (currentEdition) => currentEdition.id !== id,
    );
    return Promise.resolve(`Edition with id: ${id} deleted`);
  }

  findOne(id: number) {
    const edition = this.editions.find((edition) => edition.id === id);
    if (edition) return Promise.resolve<Edition>(edition);
    throw new Error(`Edition with id: ${id} does not exist!`);
  }

  async edit(id: number, updateEditionDTO: UpdateEditionDTO) {
    const editionToEdit = await this.findOne(id);
    editionToEdit.name = updateEditionDTO.name;
    console.log(editionToEdit);
    return Promise.resolve(editionToEdit);
  }

  resetEditions() {
    this.editions = [];
    TestEditionService.counter = 0;
  }
}

describe('EditionController', () => {
  let app: INestApplication;
  let module: TestingModule;
  let testEditionService = new TestEditionService();
  let testLeagueService = new TestLeagueService();
  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [EditionsModule, LeaguesModule],
    })
      .overrideProvider(EditionService)
      .useValue(testEditionService)
      .overrideProvider(LeagueService)
      .useValue(testLeagueService)
      .compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterEach(() => {
    testEditionService.resetEditions();
  });
  afterAll(() => {
    app.close();
  });

  it('should be able to get all editions', async () => {
    return await request(app.getHttpServer())
      .get('/editions')
      .expect(200)
      .expect([]);
  });

  it('Should be able to add new edition', async () => {
    return await request(app.getHttpServer())
      .post('/editions')
      .send({ leagueId: 1, name: 'TATA' })
      .expect(201);
  });

  it('Should be able to delete edition', async () => {
    await request(app.getHttpServer())
      .post('/editions')
      .send({ leagueId: 1, name: 'TATA' });
    request(app.getHttpServer()).get('/editions');
    const deleted = await request(app.getHttpServer())
      .delete(`/editions/1`)
      .expect(200)
      .expect('Edition with id: 1 deleted');
    return deleted;
  });

  it('Should be able edit the league', async () => {
    await request(app.getHttpServer())
      .post('/editions')
      .send({ leagueId: 1, name: 'TATA' });

    const editedLeague = await request(app.getHttpServer())
      .patch('/editions/1')
      .send({ name: 'B' })
      .expect(200);
  });
});
