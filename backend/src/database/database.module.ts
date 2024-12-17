import { Module } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { SQLITE_CONNECTION } from './config';
import * as sqlite3 from 'sqlite3';

dotenv.config();

const db = new sqlite3.Database(
  './src/database/rdc-auction.db',
  sqlite3.OPEN_READWRITE,
  (err) => {
    if (err && err.message == 'SQLITE_CANTOPEN: unable to open database file') {
      return createDatabase();
    } else if (err) {
      console.log('Getting error ' + err);
      return;
    }
  },
);

// db.exec('')

function createDatabase() {
  var newdb = new sqlite3.Database('./src/database/rdc-auction.db', (err) => {
    if (err) {
      console.log('Getting error ' + err);
    }
  });
  return newdb;
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
