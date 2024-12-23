import { Inject } from '@nestjs/common';
import { SQLITE_CONNECTION } from 'src/database/config';
import { PlayerApplication } from './entities/player.entity';

export class PlayerApplicationRepository {
  constructor(@Inject(SQLITE_CONNECTION) private connection) {}

  async getAll() {
    let applicationPromise = await new Promise<PlayerApplication[]>(
      (resolve, reject) => {
        this.connection.all(
          'select * from PlayerApplications where deletedAt is null;',
          async (error, rows) => {
            let playerApplications: PlayerApplication[] = [];
            await rows.forEach(async (row) => {
              let application: PlayerApplication = {
                auctionId: row.auctionId,
                id: row.id,
                playerId: row.playerId,
                roundBasePrice: row.roundBasePrice,
                status: row.status,
                submittedAt: row.submittedAt,
              };
              playerApplications = [...playerApplications, application];
            });
            resolve(playerApplications);
          },
        );
      },
    );
    return applicationPromise;
  }

  async add(application: PlayerApplication) {
    const insert = this.connection.prepare(
      'INSERT INTO PlayerApplications (auctionId, id, playerId, roundBasePrice, status) VALUES(?, ?, ?, ?, ?)',
    );
    let addApplicationPromise = await new Promise<PlayerApplication>(
      (resolve, reject) => {
        insert.run(
          application.auctionId,
          application.id,
          application.playerId,
          application.roundBasePrice,
          application.status,
          (err) => {
            if (err) console.log('error while inserting application');
          },
        );
        resolve(application);
      },
    );
    return addApplicationPromise;
  }

  async edit(application: PlayerApplication) {
    const updatePromise = new Promise<PlayerApplication>((resolve, reject) => {
      this.connection.exec(
        `update PlayerApplications SET roundBasePrice = ${application.roundBasePrice} where id = ${application.id}`,
        (error) => {
          if (error) console.log('error while editing application: ', error);
        },
        resolve(application),
      );
    });
    return updatePromise;
  }

  async delete(id: string) {
    this.connection.exec(
      `update PlayerApplications SET deletedAt = CURRENT_TIMESTAMP where id = '${id}';`,

      (err) => {
        if (err) console.log(err);
      },
    );

    return Promise.resolve(`Player Application of id: ${id} has been deleted`);
  }

  async get(id: string) {
    let application = (await this.getAll()).find(
      (currentApplication) => currentApplication.id === id,
    );
    if (!application) throw new Error('Application not found in get');
    return Promise.resolve<PlayerApplication>(application);
  }
}

export default PlayerApplicationRepository;
