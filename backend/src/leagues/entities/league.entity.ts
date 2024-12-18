import { CreateLeagueDTO } from '../dto/create-league.dto';
import { v4 as uuidv4 } from 'uuid';
export class League {
  public id: string;
  public name: string;
  public createdAt: string;

  constructor(league: CreateLeagueDTO) {
    this.id = uuidv4();
    this.name = league.name;
    this.createdAt = new Date().toLocaleString();
  }
}
