import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LeaguesModule } from './leagues/leagues.module';
import { EditionsModule } from './editions/editions.module';
import { DbModule } from './database/database.module';
import { PlayerApplicationModule } from './playerApplication/player.module';
import { PlayersModule } from './players/players.module';

@Module({
  imports: [
    LeaguesModule,
    EditionsModule,
    DbModule,
    PlayerApplicationModule,
    PlayersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
