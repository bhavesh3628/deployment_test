import { Module } from '@nestjs/common';
import { LeagueService } from './leagues.service';
import { LeaguesController } from './leagues.controller';
import LeaguesRepository from './leagues.repository';
import { DbModule } from 'src/database/database.module';


@Module({
  imports:[DbModule],
  controllers: [LeaguesController],
  providers: [LeagueService,LeaguesRepository],
  exports: [LeagueService],
})
export class LeaguesModule {}
