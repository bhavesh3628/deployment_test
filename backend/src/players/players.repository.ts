import { SQLITE_CONNECTION } from 'src/database/config';
import { Inject } from '@nestjs/common';
import { Player } from './entities/player.entity';
import { resolve } from 'path';
import { rejects } from 'assert';

export class PlayersRepository {
  constructor(@Inject(SQLITE_CONNECTION) private connection) {
    // add interface
    // connection.exec(`    created_at TEXT NOT NULL DEFAULT current_timestamp,`);
  }

  async getAll() {
    let playersPromise = await new Promise<Player[]>(
      async (resolve, reject) => {
        this.connection.all(
          'select * from players where deletedAt is null;',
          async (err, rows) => {
            let players: Player[] = [];
            await rows.forEach(async (row) => {
              let player: Player = {
                name: row.name,
                id: row.id,
                createdAt: row.createdAt,
                nationality: row.nationality,
                dob: row.dob,
                specialization: row.specialization,
              };
              console.log('1', player);
              players = [...players, player];
              console.log('2', players);
            });
            console.log('3', players);
            resolve(players);
          },
        );
      },
    );

    return playersPromise;
  }

  async add(player: Player) {
    const insertPlayer = this.connection.prepare(
      'INSERT INTO players (id,name,dob,nationality,specialization) VALUES (?,?,?,?,?);',
    );

    insertPlayer.run(
      player.id,
      player.name,
      player.dob,
      player.nationality,
      player.specialization,
      (err) => {
        if (err) console.log('error while adding', err);
      },
    );

    let addPlayerPromise = await new Promise<Player>((resolve, reject) => {
      resolve(player);
    });
    return addPlayerPromise;
  }

  async edit(player: Player) {
    const updatePromise = new Promise<Player>((resolve, reject) => {
      this.connection.exec(
        `update players SET name  = '${player.name}',dob= '${player.dob}',nationality= '${player.nationality}',specialization= '${player.specialization}' where id = '${player.id}';`,
        (err) => {
          if (err) console.log(err);
        },
        resolve(player),
      );
    });
    return updatePromise;
  }

  async delete(id: string) {
    this.connection.exec(
      `update players SET deletedAt = CURRENT_TIMESTAMP, 
        name = CURRENT_TIMESTAMP || ' ' || (select name from players where id = '${id}') 
        where id = '${id}';
        
        update PlayerApplications SET deletedAt = CURRENT_TIMESTAMP where playerId = '${id}';`,
      // soft delete for registered player applications is remaining
      (err) => {
        if (err) console.log(err);
      },
    );

    return Promise.resolve(`Player with id: ${id} deleted`);
  }

  async get(id: string) {
    let player = (await this.getAll()).find(
      (currentPlayer) => currentPlayer.id === id,
    );
    if (!player) throw new Error('Player not found');
    return Promise.resolve<Player>(player);
  }
}

// export const leagueRepository = new LeaguesRepository()

export default PlayersRepository;
