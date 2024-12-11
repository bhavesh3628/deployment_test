import { Injectable } from '@nestjs/common';
import { CreateLeagueDTO } from './dto/create-league.dto';
import { UpdateLeagueDTO } from './dto/update-league.dto';
import { League } from './entities/league.entity';

@Injectable()
export class LeaguesService {
  private leagues: League[] = [];
  async add(league: CreateLeagueDTO) {
    const newLeague: League = new League(league);
    this.leagues = [...this.leagues, newLeague];
    return Promise.resolve<League>(newLeague);
  }

  async getAll() {
    return Promise.resolve<League[]>(this.leagues);
  }

  findOne(id: number) {
    const league = this.leagues.find((league) => league.id === id);
    if (league) return Promise.resolve<League>(league);
    return Promise.reject('No such league exists');
  }

  async edit(id: number, updateLeagueDTO: UpdateLeagueDTO) {
    const leagues = await this.getAll();
    const leagueToEdit = leagues.find((league) => league.id === id);

    if (leagueToEdit) {
      leagueToEdit.name = updateLeagueDTO.name;
      return Promise.resolve(leagueToEdit);
    }
    return Promise.reject('League not found');
  }

  async delete(id: number) {
    this.leagues = this.leagues.filter((league) => league.id !== id);
    return Promise.resolve();
  }

  // async addEdition(edition: Edition){
  // }
}
