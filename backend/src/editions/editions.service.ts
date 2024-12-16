import { Injectable } from '@nestjs/common';
import { CreateEditionDTO } from './dto/create-edition.dto';
import { UpdateEditionDTO } from './dto/update-edition.dto';
import { Edition } from './entities/edition.entity';
import { LeagueService } from 'src/leagues/leagues.service';

export interface BackendEditionService
  extends AddEditionService,
    EditEditionService,
    DeleteEditionService,
    GetAllEditionService {}

export interface AddEditionService {
  add(league: CreateEditionDTO): Promise<Edition>;
}
export interface EditEditionService {
  edit(id: number, updateLeagueDTO: UpdateEditionDTO): Promise<Edition>;
}
export interface DeleteEditionService {
  delete(id: number): Promise<string>;
}
export interface GetAllEditionService {
  getAll(): Promise<Edition[]>;
}

@Injectable()
export class EditionService {
  private editions: Edition[] = [];
  private static counter: number = 0;
  async create(
    createEditionDTO: CreateEditionDTO,
    leagueService: LeagueService,
  ) {
    createEditionDTO.id = EditionService.counter++;
    const newEdition = new Edition(createEditionDTO);
    this.editions = [...this.editions, newEdition];
    leagueService.addEdition(newEdition);
    return Promise.resolve<Edition>(newEdition);
  }

  async getAll() {
    return Promise.resolve<Edition[]>(this.editions);
  }

  async findOne(id: number) {
    const edition = this.editions.find((edition) => edition.id === id);
    console.log('inside findOne', edition);
    if (edition) return Promise.resolve<Edition>(edition);
    throw new Error(`Edition with id: ${id} does not exist!`);
  }

  async edit(id: number, updateEditionDTO: UpdateEditionDTO) {
    const editionToEdit = await this.findOne(id);
    editionToEdit.name = updateEditionDTO.name;
    console.log(editionToEdit);
    return Promise.resolve(editionToEdit);
  }

  async delete(id: number) {
    let edition = await this.findOne(id);
    console.log('edition', edition);
    this.editions = this.editions.filter(
      (currentEdition) => currentEdition.id !== edition.id,
    );
    console.log(this.editions);
    return Promise.resolve(`Edition with id: ${id} deleted`);
  }
}
