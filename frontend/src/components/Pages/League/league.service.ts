import { Edition } from "../edition/edition.service";
import { CreateLeagueDTO, UpdateLeagueDTO } from "./types";
import axios from "axios";
export interface LeagueService
  extends GetAllLeagueService,
    AddOneLeagueService,
    DeleteOneLeagueService,
    EditOneLeagueService,
    AddEditionLeagueService {}

export interface GetAllLeagueService {
  getAll(): Promise<League[]>;
}

export interface DeleteOneLeagueService {
  deleteOne(id: number): Promise<void>;
}

export interface EditOneLeagueService {
  editOne(id: number, editedName: UpdateLeagueDTO): Promise<League>;
}

export interface AddOneLeagueService {
  addOne(leagueDTO: CreateLeagueDTO): Promise<League>;
}

export interface AddEditionLeagueService {
  addEdition(edition: Edition): Promise<void>;
}

export class RestLeagueService implements LeagueService {
  async getAll(): Promise<League[]> {
    const { data } = await axios.get("http://localhost:3000/leagues");
    return data;
  }
  async addOne(league: CreateLeagueDTO): Promise<League> {
    const newLeague: League = await axios.post(
      "http://localhost:3000/leagues",
      league
    );
    return newLeague;
  }

  async deleteOne(id: number): Promise<void> {
    await axios.delete(`http://localhost:3000/leagues/${id}`);
  }

  async editOne(id: number, updateLeagueDTO: UpdateLeagueDTO): Promise<League> {
    const editedLeague: League = await axios.patch(
      `http://localhost:3000/leagues/${id}`,
      updateLeagueDTO
    );
    console.log(editedLeague);
    console.log("Edited name", name);
    return Promise.resolve(editedLeague);
  }

  async addEdition(edition: Edition): Promise<void> {
    const leagues = await this.getAll();
    const league = leagues.find((league) => league.id === edition.leagueId);
    if (!league) return Promise.reject("League not found");

    league.editions = [...league.editions, edition];

    localStorage.setItem("leagues", JSON.stringify([...leagues]));
  }
}

export class LocallyStoredLeagueService implements LeagueService {
  async getAll() {
    const leagues = localStorage.getItem("leagues");

    if (leagues) return Promise.resolve<League[]>(JSON.parse(leagues));

    return Promise.resolve([]);
  }

  async addOne(league: CreateLeagueDTO) {
    const newLeague: League = new League(league);
    console.log(newLeague);
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

  async editOne(leagueId: number, editedName: UpdateLeagueDTO) {
    const leagues = await this.getAll();
    const leagueToEdit = leagues.find((league) => league.id === leagueId);

    if (leagueToEdit) {
      leagueToEdit.name = editedName.name;
      localStorage.setItem("leagues", JSON.stringify([...leagues]));
      return Promise.resolve(leagueToEdit);
    }

    return Promise.reject("League not found");
  }

  async addEdition(edition: Edition): Promise<void> {
    const leagues = await this.getAll();
    const league = leagues.find((league) => league.id === edition.leagueId);
    if (!league) return Promise.reject("League not found");

    league.editions = [...league.editions, edition];

    localStorage.setItem("leagues", JSON.stringify([...leagues]));
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
const leagueService = new RestLeagueService();
export default leagueService;
