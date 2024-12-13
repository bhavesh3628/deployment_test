import { Injectable } from '@nestjs/common';
import { CreateLeagueDTO } from './dto/create-league.dto';
import { UpdateLeagueDTO } from './dto/update-league.dto';
import { League } from './entities/league.entity';

export interface BackendLeagueService
  extends AddLeagueService,
    EditLeagueService,
    DeleteLeagueService,
    GetAllLeagueService {}

export interface AddLeagueService {
  add(league: CreateLeagueDTO): Promise<League>;
}
export interface EditLeagueService {
  edit(id: number, updateLeagueDTO: UpdateLeagueDTO): Promise<League>;
}
export interface DeleteLeagueService {
  delete(id: number): Promise<string>;
}
export interface GetAllLeagueService {
  getAll(): Promise<League[]>;
}

@Injectable()
export class LeagueService implements BackendLeagueService {
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
    throw new Error(`League with id: ${id} does not exist!`);
  }

  async edit(id: number, updateLeagueDTO: UpdateLeagueDTO) {
    const leagueToEdit = await this.findOne(id);
    leagueToEdit.name = updateLeagueDTO.name;
    console.log(leagueToEdit);
    return Promise.resolve(leagueToEdit);
  }

  async delete(id: number): Promise<string> {
    let league = await this.findOne(id);
    this.leagues = this.leagues.filter(
      (currentLeague) => currentLeague.id !== league.id,
    );
    return Promise.resolve(`League with id: ${id} deleted`);
  }

  // async addEdition(edition: Edition){
  // }
}
