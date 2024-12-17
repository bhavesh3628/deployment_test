import { Edition } from 'src/editions/entities/edition.entity';
import { CreateLeagueDTO } from '../dto/create-league.dto';

export class League {
  public id: number;
  public name: string;
  public editions: Edition[];
  public createdAt: string;

  constructor(id:number, league: CreateLeagueDTO) {
    this.id=id
    this.name = league.name;
    this.editions = [];
    this.createdAt = new Date().toLocaleString();
  }
}
