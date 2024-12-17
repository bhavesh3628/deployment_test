import { League } from './entities/league.entity';
import { SQLITE_CONNECTION } from 'src/database/config';
import { Inject } from '@nestjs/common';

export class LeaguesRepository {
  private leagues: League[] = [];
  constructor(@Inject(SQLITE_CONNECTION) private connection) {
    // add interface
    // connection.exec(`    created_at TEXT NOT NULL DEFAULT current_timestamp,`);
  }

  async getAll() {
    let leaguesPromise = await new Promise<League[]>((resolve, reject) => {
      this.connection.all('select * from leagues;', async (err, rows) => {
        let leagues: League[] = [];
        await rows.forEach(async (row) => {
          let league: League = {
            name: row.name,
            id: row.id,
            editions: [],
            createdAt: '123',
          };
          leagues = [...leagues, league];
        });
        resolve(leagues);
      });
    });

    return leaguesPromise;
  }

  async add(league: League) {
    this.leagues = [...this.leagues, league];
    return Promise.resolve<League>(league);
  }

  async edit(league: League) {
    let updatedLeague = await this.get(league.id);
    updatedLeague = league;
    return Promise.resolve<League>(updatedLeague);
  }

  async delete(id: number) {
    await this.get(id);
    this.leagues = this.leagues.filter((league) => league.id !== id);
    return Promise.resolve(`League with id: ${id} deleted`);
  }

  async get(id: number) {
    let league = await this.leagues.find(
      (currentLeague) => currentLeague.id === id,
    );
    if (!league) throw new Error('League not found');
    return Promise.resolve<League>(league);
  }
}

// export const leagueRepository = new LeaguesRepository()

export default LeaguesRepository;
