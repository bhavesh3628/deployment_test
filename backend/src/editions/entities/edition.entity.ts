import { CreateEditionDTO } from '../dto/create-edition.dto';

export class Edition {
  public readonly leagueId: number;
  public name: string;
  public readonly id: number;
  private static counter: number = 0;
  public auctionId?: number;

  constructor(edition: CreateEditionDTO) {
    this.leagueId = edition.leagueId;
    this.name = edition.name;
    this.id = edition.id;
  }
}
