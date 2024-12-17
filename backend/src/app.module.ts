import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LeaguesModule } from './leagues/leagues.module';
import { EditionsModule } from './editions/editions.module';
import { DbModule } from './database/database.module';

@Module({
  imports: [LeaguesModule, EditionsModule, DbModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
