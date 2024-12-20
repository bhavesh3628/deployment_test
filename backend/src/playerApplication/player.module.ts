import { Module } from '@nestjs/common';
import { PlayerApplicationService } from './player.service';
import { PlayerController } from './player.controller';
import { DbModule } from 'src/database/database.module';
import PlayerApplicationRepository from './player.repository';

@Module({
  imports: [DbModule],
  controllers: [PlayerController],
  //  might need to import player Service.
  providers: [PlayerApplicationService, PlayerApplicationRepository],
  exports: [PlayerApplicationService],
})
export class PlayerApplicationModule {}
