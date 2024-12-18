import { Inject, Injectable } from '@nestjs/common';
import { SQLITE_CONNECTION } from './database/config';

@Injectable()
export class AppService {
  private dbHealthCheck: string;
  constructor(@Inject(SQLITE_CONNECTION) private connection) {
    connection.all('select CURRENT_TIMESTAMP', (err, rows) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      this.dbHealthCheck = rows[0];
    });
  }
  getHealth(): string {
    return this.dbHealthCheck;
  }
  getHello(): string {
    return 'hello world';
  }
}
