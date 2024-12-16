import { Module } from '@nestjs/common';
import { EditionService } from './editions.service';
import { EditionsController } from './editions.controller';
import { LeaguesModule } from 'src/leagues/leagues.module';

@Module({
  imports: [LeaguesModule],
  controllers: [EditionsController],
  providers: [EditionService],
  exports: [EditionsModule],
})
export class EditionsModule {}
