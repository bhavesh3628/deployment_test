import axios from "axios";
import { CreateEditionDTO, UpdateEditionDTO } from "./types";

export interface EditionService
  extends GetAllEditionService,
    DeleteOneEditionService,
    AddOneEditionService,
    EditOneEditionService {}

export interface GetAllEditionService {
  getAll(): Promise<Edition[]>;
}

export interface DeleteOneEditionService {
  deleteOne(id: number): Promise<void>;
}

export interface EditOneEditionService {
  editOne(id: number, editedName: UpdateEditionDTO): Promise<Edition>;
}

export interface AddOneEditionService {
  addOne(edition: CreateEditionDTO): Promise<Edition>;
}

export class RestEditionService implements EditionService {
  async getAll(): Promise<Edition[]> {
    const { data } = await axios.get("http://localhost:3000/editions");
    return data;
  }
  async addOne(edition: CreateEditionDTO): Promise<Edition> {
    const newEdition: Edition = await axios.post(
      "http://localhost:3000/editions",
      edition
    );
    return newEdition;
  }

  async deleteOne(id: number): Promise<void> {
    await axios.delete(`http://localhost:3000/editions/${id}`);
  }

  async editOne(id: number, editedName: UpdateEditionDTO): Promise<Edition> {
    const editedEdition: Edition = await axios.patch(
      `http://localhost:3000/editions/${id}`,
      editedName
    );
    return Promise.resolve(editedEdition);
  }
}

export class LocallyStoredEditionService implements EditionService {
  async getAll(leagueId?: string) {
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

  async editOne(id: number, editedName: UpdateEditionDTO) {
    const editions = await this.getAll();
    const edition = editions.find((edition) => edition.id === id);

    if (edition) {
      edition.name = editedName.name;
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
  public readonly leagueId: string;
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

const editionService = new RestEditionService();
export default editionService;
