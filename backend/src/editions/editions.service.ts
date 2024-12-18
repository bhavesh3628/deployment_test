import { Injectable } from '@nestjs/common';
import { CreateEditionDTO } from './dto/create-edition.dto';
import { UpdateEditionDTO } from './dto/update-edition.dto';
import { Edition } from './entities/edition.entity';
import { EditionRepository } from './editions.repository';

export interface BackendEditionService
  extends AddEditionService,
    EditEditionService,
    DeleteEditionService,
    GetAllEditionService {}

export interface AddEditionService {
  add(league: CreateEditionDTO): Promise<Edition>;
}
export interface EditEditionService {
  edit(id: string, updateLeagueDTO: UpdateEditionDTO): Promise<Edition>;
}
export interface DeleteEditionService {
  delete(id: string): Promise<string>;
}
export interface GetAllEditionService {
  getAll(): Promise<Edition[]>;
}

@Injectable()
export class EditionService {
  constructor(private readonly editionRepository: EditionRepository) {}

  async create(createEditionDTO: CreateEditionDTO) {
    const newEdition = new Edition(createEditionDTO);
    return this.editionRepository.add(newEdition);
  }

  async getAll() {
    return this.editionRepository.getAll();
  }

  async findOne(id: string) {
    return this.editionRepository.get(id);
  }

  async edit(id: string, updateEditionDTO: UpdateEditionDTO) {
    const editionToEdit = await this.findOne(id);
    editionToEdit.name = updateEditionDTO.name;
    return await this.editionRepository.edit(editionToEdit);
  }

  async delete(id: string) {
    return this.editionRepository.delete(id);
  }
}
