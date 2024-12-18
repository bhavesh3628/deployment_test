import { CreateEditionDTO } from '../dto/create-edition.dto';
import { v4 as uuidv4 } from 'uuid';
export class Edition {
  public readonly leagueId: string;
  public name: string;
  public readonly id: string;
  public auctionId?: number;

  constructor(edition: CreateEditionDTO) {
    this.leagueId = edition.leagueId;
    this.name = edition.name;
    this.id = uuidv4();
  }
}
