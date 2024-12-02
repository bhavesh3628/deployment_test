import { League } from "../league/league.service";
import { CreateEditionDTO } from "./types";

export class EditionService {
  async getAll(leagueId?: number) {
    let editions = JSON.parse(localStorage.getItem("editions")!);
    if (editions) {
      if (leagueId) {
        let leagueEditions = editions.filter(
          (edition: Edition) => edition.leagueId === leagueId
        );
        return Promise.resolve<Edition[]>(leagueEditions);
      }
      return Promise.resolve<Edition[]>(editions);
    }

    return Promise.resolve([]);
  }

  async addOne(edition: CreateEditionDTO) {
    let newEdition = new Edition(edition);
    const editions = await this.getAll();

    localStorage.setItem("editions", JSON.stringify([...editions, newEdition]));

    return Promise.resolve(newEdition);
  }

  async deleteOne(id: number) {
    const editions = await this.getAll();
    localStorage.setItem(
      "editions",
      JSON.stringify(editions.filter((edition) => edition.id !== id))
    );
  }

  async editOne(id: number, editedName: string) {
    const editions = await this.getAll();
    const edition = editions.find((edition) => edition.id === id);

    if (edition) {
      edition.name = editedName;
      localStorage.setItem("editions", JSON.stringify([...editions]));
      return Promise.resolve(edition);
    }
    return Promise.reject("Edition not found");
  }

  async setAuctionId(editionId: number, auctionId: number) {
    const editions = await this.getAll();
    let edition = editions.find((edition) => edition.id === editionId);
    if (edition) {
      edition.auctionId = auctionId;
    }
  }

  async findEdition(editionId: number) {
    const editions = await this.getAll();
    const edition = editions.find((edition) => edition.id === editionId);
    if (edition) {
      return Promise.resolve(edition);
    } else {
      return Promise.reject("Edition not found");
    }
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
