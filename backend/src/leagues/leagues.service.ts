import {  Injectable } from '@nestjs/common';
import { CreateLeagueDTO } from './dto/create-league.dto';
import { UpdateLeagueDTO } from './dto/update-league.dto';
import { League } from './entities/league.entity';
import { Edition } from 'src/editions/entities/edition.entity';
import LeaguesRepository from './leagues.repository';
export interface BackendLeagueService
  extends AddLeagueService,
    EditLeagueService,
    DeleteLeagueService,
    GetAllLeagueService,
    AddEditionToLeagueService {}

export interface AddEditionToLeagueService {
  addEdition(edition: Edition): Promise<string>;
}

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
  private static counter: number = 1;
  constructor(private readonly leagueRepository:LeaguesRepository){

  }
 
  async add(leagueDTO: CreateLeagueDTO) {
    const id =LeagueService.counter++
    const newLeague: League = new League(id, leagueDTO);
    return Promise.resolve<League>(this.leagueRepository.add(newLeague))
  }

  async getAll() {
    return await this.leagueRepository.getAll()
  }

  async findOne(id: number) {
    return await this.leagueRepository.get(id)
  }

  async addEdition(edition: Edition): Promise<string> {
    const league = await this.leagueRepository.get(edition.leagueId);
    league.editions = [...league.editions, edition];
    const editedLeague = await this.leagueRepository.edit(league)
    return Promise.resolve(
      `Edition has been added to league ${editedLeague.name}`,
    );
  }

  async edit(id: number, updateLeagueDTO: UpdateLeagueDTO) {
    const leagueToEdit = await this.findOne(id);
    leagueToEdit.name = updateLeagueDTO.name;
    return await this.leagueRepository.edit(leagueToEdit)
  }

  async delete(id: number): Promise<string> {
    return await this.leagueRepository.delete(id)
  }
}
