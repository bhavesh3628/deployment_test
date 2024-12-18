import { Inject } from '@nestjs/common';
import { SQLITE_CONNECTION } from 'src/database/config';
import { Edition } from './entities/edition.entity';

export class EditionRepository {
  constructor(@Inject(SQLITE_CONNECTION) private connection) {}

  async getAll() {
    let editionsPromise = await new Promise<Edition[]>((resolve, reject) => {
      this.connection.all(
        'select * from editions where deletedAt is null;',
        async (err, rows) => {
          let editions: Edition[] = [];
          await rows.forEach(async (row) => {
            let edition: Edition = {
              name: row.name,
              id: row.id,
              leagueId: row.leagueId,
            };
            editions = [...editions, edition];
            // console.log('single row: ', row);
          });
          resolve(editions);
        },
      );
    });
    return editionsPromise;
  }

  async add(edition: Edition) {
    const insert = this.connection.prepare(
      'INSERT INTO editions (id,name,leagueId) VALUES (?,?,?)',
    );
    let addEditionPromise = await new Promise<Edition>((resolve, reject) => {
      insert.run(edition.id, edition.name, edition.leagueId, (err) => {
        console.log('error while adding in Edition: ', err);
      });
      resolve(edition);
    });
    return addEditionPromise;
  }

  async delete(id: string) {
    this.connection.exec(
      `update editions SET deletedAt = CURRENT_TIMESTAMP , name = CURRENT_TIMESTAMP || ' ' || (select name from editions where id = '${id}') where id = '${id}';`,
      (err) => {
        if (err) console.log(err);
      },
    );
    return Promise.resolve(`Edition with id: ${id} deleted`);
  }

  async edit(edition: Edition) {
    const updatePromise = new Promise<Edition>((resolve, reject) => {
      this.connection.exec(
        `update editions SET name = '${edition.name}' where id = '${edition.id}';`,
        (err) => {
          if (err) console.log(err);
        },
        resolve(edition),
      );
    });
    return updatePromise;
  }

  async get(id: string) {
    let edition = (await this.getAll()).find(
      (currentEdition) => currentEdition.id === id,
    );
    if (!edition) throw new Error('Edition not found');
    return Promise.resolve<Edition>(edition);
  }
}

export default EditionRepository;
