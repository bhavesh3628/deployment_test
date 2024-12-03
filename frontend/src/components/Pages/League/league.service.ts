import { Edition } from "../../../../../Edition/editionService";
import { CreateLeagueDTO } from "./types";

export interface LeagueService {
  addOne(league:CreateLeagueDTO): Promise<League>
  editOne(leagueId: number, editedName: string): Promise<League>
}

export interface GetAllLeagueService {
  getAll() :Promise<League[]>;
}

export interface DeleteOneLeagueService {
  deleteOne(id:number): Promise<void>
}

export class LocallyStoredLeagueService {
  async getAll() {
    const leagues = localStorage.getItem("leagues");

    if (leagues) return Promise.resolve<League[]>(JSON.parse(leagues));

    return Promise.resolve([]);
  }

  async addOne(league: CreateLeagueDTO) {
    const newLeague: League = new League(league);
    const leagues = await this.getAll();

    localStorage.setItem("leagues", JSON.stringify([...leagues, newLeague]));

    return newLeague;
  }

  async deleteOne(id: number) {
    const leagues = await this.getAll();
    localStorage.setItem(
      "leagues",
      JSON.stringify(leagues.filter((league) => league.id !== id))
    );
  }

  async editOne(leagueId: number, editedName: string) {
    const leagues = await this.getAll();
    const leagueToEdit = leagues.find((league) => league.id === leagueId);

    if (leagueToEdit) {
      leagueToEdit.name = editedName;
      localStorage.setItem("leagues", JSON.stringify([...leagues]));
      return Promise.resolve(leagueToEdit);
    }

    return Promise.reject("League not found");
  }
}

export class League {
  public static counter: number = 0;
  public id: number;
  public name: string;
  public editions: Edition[];
  public createdAt: string;

  constructor(league: CreateLeagueDTO) {
    League.counter += 1;
    this.name = league.name;
    this.id = League.counter;
    this.editions = [];
    this.createdAt = new Date().toLocaleString();
  }
}
const leagueService = new LocallyStoredLeagueService();
export default leagueService;
