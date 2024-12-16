import { Injectable } from '@nestjs/common';

import * as sqlite3 from 'sqlite3';

@Injectable()
export class DatabaseService {
  private db: sqlite3.Database;

  constructor() {
    this.db = new sqlite3.Database('your_database.db');
  }

  async getSomething(id: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.get('SELECT * FROM your_table WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        resolve(row);
      });
    });
  }
}
