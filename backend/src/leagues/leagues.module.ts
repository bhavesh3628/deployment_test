import { Module } from '@nestjs/common';
import { LeagueService } from './leagues.service';
import { LeaguesController } from './leagues.controller';

@Module({
  controllers: [LeaguesController],
  providers: [LeagueService],
})
export class LeaguesModule {}
