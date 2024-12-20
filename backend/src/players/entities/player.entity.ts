import { CreatePlayerDTO } from '../dto/create-player.dto';
import { v4 as uuidv4 } from 'uuid';

export class Player {
  public readonly id: string;
  public name: string;
  public nationality: string;
  public dob: string;
  public specialization: string;
  public createdAt: string;

  constructor(newPlayer: CreatePlayerDTO) {
    this.id = uuidv4();
    this.name = newPlayer.name;
    this.nationality = newPlayer.nationality;
    this.specialization = newPlayer.specialization;
    this.dob = newPlayer.dob;
  }
}
