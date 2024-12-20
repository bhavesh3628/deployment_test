import { Injectable } from '@nestjs/common';
import { CreatePlayerDTO } from './dto/create-player.dto';
import { UpdatePlayerDTO } from './dto/update-player.dto';
import { Player } from './entities/player.entity';
import PlayersRepository from './players.repository';
export interface BackendPlayerService
  extends AddPlayerService,
    EditPlayerService,
    DeletePlayerService,
    GetAllPlayerService {}

export interface AddPlayerService {
  add(player: CreatePlayerDTO): Promise<Player>;
}
export interface EditPlayerService {
  edit(id: string, updateLeagueDTO: UpdatePlayerDTO): Promise<Player>;
}
export interface DeletePlayerService {
  delete(id: string): Promise<string>;
}
export interface GetAllPlayerService {
  getAll(): Promise<Player[]>;
}
@Injectable()
export class PlayersService implements BackendPlayerService {
  constructor(private readonly playerRepository: PlayersRepository) {}
  async add(createPlayerDto: CreatePlayerDTO) {
    const newPlayer: Player = new Player(createPlayerDto);
    return Promise.resolve<Player>(this.playerRepository.add(newPlayer));
  }

  async getAll() {
    return await this.playerRepository.getAll();
  }

  async findOne(id: string) {
    return await this.playerRepository.get(id);
  }

  async edit(id: string, updatePlayerDto: UpdatePlayerDTO) {
    const playerToEdit = await this.findOne(id);
    if (updatePlayerDto.name) playerToEdit.name = updatePlayerDto.name;
    if (updatePlayerDto.dob) playerToEdit.dob = updatePlayerDto.dob;
    if (updatePlayerDto.nationality)
      playerToEdit.nationality = updatePlayerDto.nationality;
    if (updatePlayerDto.specialization)
      playerToEdit.specialization = updatePlayerDto.specialization;
    return await this.playerRepository.edit(playerToEdit);
  }

  async delete(id: string) {
    return await this.playerRepository.delete(id);
  }
}
