import { Module } from '@nestjs/common';
import { EditionService } from './editions.service';
import { EditionsController } from './editions.controller';
import { LeaguesModule } from 'src/leagues/leagues.module';
import { DbModule } from 'src/database/database.module';
import EditionRepository from './editions.repository';

@Module({
  imports: [LeaguesModule, DbModule],
  controllers: [EditionsController],
  providers: [EditionService, EditionRepository],
  exports: [EditionsModule],
})
export class EditionsModule {}
