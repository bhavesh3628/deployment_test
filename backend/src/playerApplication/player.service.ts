import { Injectable } from '@nestjs/common';
import { CreatePlayerApplicationDTO } from './dto/create-player.dto';
import { UpdatePlayerApplicationDto } from './dto/update-player.dto';
import { PlayerApplication } from './entities/player.entity';
import PlayerApplicationRepository from './player.repository';

export interface BackendRegisterPlayerService
  extends AddRegisterPlayerService,
    DeleteOneRegisterPlayerService,
    GetAllRegisterPlayerService,
    EditOneRegisterPlayerService {}

export interface AddRegisterPlayerService {
  addOne(application: CreatePlayerApplicationDTO): Promise<PlayerApplication>;
}
export interface DeleteOneRegisterPlayerService {
  deleteOne(id: string): Promise<string>;
}
export interface GetAllRegisterPlayerService {
  getAll(): Promise<PlayerApplication[]>;
}
export interface EditOneRegisterPlayerService {
  editOne(
    applicaitonId: string,
    updateApplicaitonDTO: UpdatePlayerApplicationDto,
  ): Promise<PlayerApplication>;
}

@Injectable()
export class PlayerApplicationService implements BackendRegisterPlayerService {
  constructor(
    private readonly playerApplicationRepository: PlayerApplicationRepository,
  ) {}

  addOne(application: CreatePlayerApplicationDTO): Promise<PlayerApplication> {
    const newApplication: PlayerApplication = new PlayerApplication(
      application,
    );
    return Promise.resolve<PlayerApplication>(
      this.playerApplicationRepository.add(newApplication),
    );
  }

  async deleteOne(id: string): Promise<string> {
    return await this.playerApplicationRepository.delete(id);
  }

  async editOne(
    applicaitonId: string,
    updateApplicaitonDTO: UpdatePlayerApplicationDto,
  ): Promise<PlayerApplication> {
    const applicationToEdit = await this.findOne(applicaitonId);
    applicationToEdit.roundBasePrice = updateApplicaitonDTO.roundBasePrice;
    return await this.playerApplicationRepository.edit(applicationToEdit);
  }

  async findOne(id: string) {
    return await this.playerApplicationRepository.get(id);
  }
  async getAll(): Promise<PlayerApplication[]> {
    return await this.playerApplicationRepository.getAll();
  }
}
