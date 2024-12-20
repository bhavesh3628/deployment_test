import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PlayerApplicationService } from './player.service';
import { CreatePlayerApplicationDTO } from './dto/create-player.dto';
import { UpdatePlayerApplicationDto } from './dto/update-player.dto';

@Controller('playerapplications')
export class PlayerController {
  constructor(private readonly playerService: PlayerApplicationService) {}

  @Post()
  create(@Body() createRegisterPlayerDto: CreatePlayerApplicationDTO) {
    /*
    playerId: string;
    auctionId: string;
    roundBasePrice: RoundBasePrice;
    */
    return this.playerService.addOne(createRegisterPlayerDto);
  }

  @Get()
  findAll() {
    return this.playerService.getAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.playerService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePlayerDto: UpdatePlayerApplicationDto,
  ) {
    return this.playerService.editOne(id, updatePlayerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.playerService.deleteOne(id);
  }
}
