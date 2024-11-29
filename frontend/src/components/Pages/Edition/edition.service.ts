import { CreateEditionDTO } from "./types";

export class EditionService {
  public editions: Edition[] = [];
  getAll(leagueId?: number) {
    if (leagueId) {
      return this.editions.filter((edition) => edition.leagueId === leagueId);
    }

    return this.editions;
  }

  addOne(edition: CreateEditionDTO) {
    let newEdition = new Edition(edition);

    this.editions = [...this.editions, newEdition];

    return newEdition;
  }

  deleteOne(id: number) {
    this.editions = this.editions.filter((edition) => edition.id !== id);
  }

  editOne(id: number, editedName: string) {
    let edition = this.findEdition(id);
    if (edition) {
      edition.name = editedName;
      return edition;
    } else throw new Error("Edition not found");
  }

  setAuctionId(editionId: number, auctionId: number) {
    let edition = this.editions.find((edition) => edition.id === editionId);
    if (edition) {
      edition.auctionId = auctionId;
    }
  }

  findEdition(editionId: number) {
    return this.editions.find((edition) => edition.id === editionId);
  }
}

export class Edition {
  public readonly leagueId: number;
  public name: string;
  public readonly id: number;
  private static counter: number = 0;
  public auctionId?: number;

  constructor(edition: CreateEditionDTO) {
    this.leagueId = edition.leagueId;
    this.name = edition.name;
    Edition.counter += 1;
    this.id = Edition.counter;
  }
}

const editionService = new EditionService();

export default editionService;
