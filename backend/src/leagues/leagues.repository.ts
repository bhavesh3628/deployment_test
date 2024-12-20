import { League } from './entities/league.entity';
import { SQLITE_CONNECTION } from 'src/database/config';
import { Inject } from '@nestjs/common';

export class LeaguesRepository {
  constructor(@Inject(SQLITE_CONNECTION) private connection) {
    // add interface
    // connection.exec(`    created_at TEXT NOT NULL DEFAULT current_timestamp,`);
  }

  async getAll() {
    let leaguesPromise = await new Promise<League[]>((resolve, reject) => {
      this.connection.all(
        'select * from leagues where deletedAt is null;',
        async (err, rows) => {
          let leagues: League[] = [];
          await rows.forEach((row) => {
            let league: League = {
              name: row.name,
              id: row.id,
              createdAt: row.createdAt,
            };
            console.log('1', league);
            leagues = [...leagues, league];
            console.log('2', leagues);
          });
          console.log('3', leagues);
          resolve(leagues);
        },
      );
    });

    return leaguesPromise;
  }

  async add(league: League) {
    const insert = this.connection.prepare(
      'INSERT INTO leagues (id,name) VALUES (?,?)',
    );
    let addLeaguePromise = await new Promise<League>((resolve, reject) => {
      insert.run(league.id, league.name, (err) => {
        console.log('error while adding', err);
      });
      resolve(league);
    });
    return addLeaguePromise;
  }

  async edit(league: League) {
    const updatePromise = new Promise<League>((resolve, reject) => {
      this.connection.exec(
        `update leagues SET name = '${league.name}' where id = '${league.id}';`,
        (err) => {
          if (err) console.log(err);
        },
        resolve(league),
      );
    });
    return updatePromise;
  }

  async delete(id: string) {
    this.connection.exec(
      `update leagues SET deletedAt = CURRENT_TIMESTAMP, 
        name = CURRENT_TIMESTAMP || ' ' || (select name from leagues where id = '${id}') 
        where id = '${id}';
        
        update editions SET deletedAt = CURRENT_TIMESTAMP,
         name = CURRENT_TIMESTAMP || ' ' || (select name from editions where leagueId = '${id}') 
        where leagueId = '${id}'  
        `,

      (err) => {
        if (err) console.log(err);
      },
    );

    return Promise.resolve(`League with id: ${id} deleted`);
  }

  async get(id: string) {
    let league = (await this.getAll()).find(
      (currentLeague) => currentLeague.id === id,
    );
    if (!league) throw new Error('League not found');
    return Promise.resolve<League>(league);
  }
}

// export const leagueRepository = new LeaguesRepository()

export default LeaguesRepository;
