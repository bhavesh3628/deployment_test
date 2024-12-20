import { Module } from '@nestjs/common';
import { PlayersService } from './players.service';
import { PlayersController } from './players.controller';
import { DbModule } from 'src/database/database.module';
import PlayersRepository from './players.repository';

@Module({
  imports: [DbModule],
  controllers: [PlayersController],
  providers: [PlayersService, PlayersRepository],
})
export class PlayersModule {}
