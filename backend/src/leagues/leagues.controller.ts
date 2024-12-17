import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { LeagueService } from './leagues.service';
import { CreateLeagueDTO } from './dto/create-league.dto';
import { UpdateLeagueDTO } from './dto/update-league.dto';

@Controller('leagues')
export class LeaguesController {
  constructor(private readonly leagueService: LeagueService) {}

  @Post()
  async create(@Body() createLeagueDTO: CreateLeagueDTO) {
    return await this.leagueService.add(createLeagueDTO);
  }

  @Get()
  async findAll() {
    return await this.leagueService.getAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.leagueService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLeagueDTO: UpdateLeagueDTO) {
    return this.leagueService.edit(+id, updateLeagueDTO);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.leagueService.delete(+id);
  }
}
