import { Module } from '@nestjs/common';
// import * as dotenv from 'dotenv';
import { SQLITE_CONNECTION } from './config';
import * as sqlite3 from 'sqlite3';
import * as fs from 'fs';

let db: sqlite3.Database = openDatabase();

export function openDatabase() {
  if (fs.existsSync('./src/database/rdc-auction.db')) {
    return new sqlite3.Database(
      './src/database/rdc-auction.db',
      sqlite3.OPEN_READWRITE,
      (err) => {
        if (err) {
          console.log('getting error: ', err);
          return;
        }
      },
    );
  } else {
    return createDatabase();
  }
}

function createDatabase() {
  let newdb = new sqlite3.Database(
    './src/database/rdc-auction.db',

    (err) => {
      if (err) {
        console.log('Getting error inside create db ' + err);
      }
    },
  );

  createTables(newdb);
  return newdb;
}

function createTables(db: sqlite3.Database) {
  console.log('inside create table');
  fs.readFile(
    'C:/Users/ishaa/Documents/GitHub/rdc2-auction/backend/src/database/tables.sql',
    (err, data) => {
      console.log(data.toString());
      let queries = data.toString().split(';');
      queries.forEach((query) => {
        console.log(queries);
        db.exec(query, (err) => {
          if (err && err['errno'] === 19) {
            console.log('Name already exists', query);
          } else {
            console.log('Getting error inside create tables ' + err);
          }
        });
      });
      if (err) {
        console.log('getting error from fs readfile', err);
      }
    },
  );
}

const dbProvider = {
  provide: SQLITE_CONNECTION,
  useValue: db,
};

@Module({
  providers: [dbProvider],
  exports: [dbProvider],
})
export class DbModule {}
