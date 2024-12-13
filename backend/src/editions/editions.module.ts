import { Module } from '@nestjs/common';
import { EditionService } from './editions.service';
import { EditionsController } from './editions.controller';

@Module({
  controllers: [EditionsController],
  providers: [EditionService],
})
export class EditionsModule {}
