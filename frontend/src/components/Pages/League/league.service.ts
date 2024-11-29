import { Edition } from "../../../../../Edition/editionService";
import { CreateLeagueDTO } from "./types";

export class LeagueService {
  public leagues: League[] = [];

  getAll() {
    return this.leagues;
  }

  addOne(league: CreateLeagueDTO) {
    let newLeague: League = new League(league);
    this.leagues = [...this.leagues, newLeague];
    return newLeague;
  }

  deleteOne(id: number) {
    this.leagues = this.leagues.filter((league) => league.id !== id);
  }
  findLeague(LeagueId: number) {
    const league = this.leagues.find((League) => League.id === LeagueId);
    if (league) return league;
    else throw new Error("league not found");
  }

  editOne(leagueId: number, editedName: string) {
    let league = this.findLeague(leagueId);
    if (league) {
      league.name = editedName;
      return league;
    } else throw new Error("League not found");
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
export const leagueService = new LeagueService();
