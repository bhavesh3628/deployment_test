import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { LeaguesService } from './leagues.service';
import { CreateLeagueDTO } from './dto/create-league.dto';
import { UpdateLeagueDTO } from './dto/update-league.dto';

@Controller('leagues')
export class LeaguesController {
  constructor(private readonly leaguesService: LeaguesService) {}

  @Post()
  async create(@Body() createLeagueDTO: CreateLeagueDTO) {
    return await this.leaguesService.add(createLeagueDTO);
  }

  @Get()
  findAll() {
    return this.leaguesService.getAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.leaguesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLeagueDTO: UpdateLeagueDTO) {
    return this.leaguesService.edit(+id, updateLeagueDTO);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.leaguesService.delete(+id);
  }
}
