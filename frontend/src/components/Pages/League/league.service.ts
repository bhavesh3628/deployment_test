import { Edition } from "../../../../../Edition/editionService";
import { CreateLeagueDTO } from "./types";

export class LeagueService {
  async getAll() {
    let leagues = localStorage.getItem("leagues");

    if (leagues) return Promise.resolve<League[]>(JSON.parse(leagues));

    return Promise.resolve([]);
  }

  async addOne(league: CreateLeagueDTO) {
    let newLeague: League = new League(league);
    let leagues = await this.getAll();

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

  async findLeague(leagueId: number) {
    const leagues = await this.getAll();
    const league = leagues.find((league) => league.id === leagueId);

    if (league) return Promise.resolve(league);

    return Promise.reject("League not found");
  }

  async editOne(leagueId: number, editedName: string) {
    let leagues = await this.getAll();
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
const leagueService = new LeagueService();
export default leagueService;
