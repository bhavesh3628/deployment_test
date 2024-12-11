import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LeaguesModule } from './leagues/leagues.module';
import { EditionsModule } from './editions/editions.module';

@Module({
  imports: [LeaguesModule, EditionsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
