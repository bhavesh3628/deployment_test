// import { RoundBasePrice } from "../Application/Player/types";
import axios from "axios";
import {
  // CreateApprovedPlayerDTO,
  CreatePlayerDTO,
  EditPlayerDTO,
} from "./types";
import { v4 as uuidv4 } from "uuid";

export interface PlayerService
  extends GetAllPlayerService,
    AddOnePlayerService,
    EditOnePlayerService,
    DeleteOnePlayerService,
    FindOnePlayerService {}

export interface GetAllPlayerService {
  getAll(): Promise<Player[]>;
}
export interface AddOnePlayerService {
  addOne(playerDTO: CreatePlayerDTO): Promise<Player>;
}
export interface EditOnePlayerService {
  editOne(id: string, editedPlayer: EditPlayerDTO): Promise<Player>;
}
export interface DeleteOnePlayerService {
  deleteOne(id: string): Promise<void>;
}
export interface FindOnePlayerService {
  findOne(id: string): Promise<Player>;
}

export class RestPlayerService implements PlayerService {
  async getAll(): Promise<Player[]> {
    const { data } = await axios.get("http://localhost:3000/players");
    return data;
  }
  async addOne(createPlayerDTO: CreatePlayerDTO): Promise<Player> {
    const newPlayer: Player = await axios.post(
      "http://localhost:3000/players",
      createPlayerDTO
    );
    return newPlayer;
  }

  async editOne(id: string, updatedPlayerDTO: EditPlayerDTO): Promise<Player> {
    const editedPlayer: Player = await axios.patch(
      `http://localhost:3000/players/${id}`,
      updatedPlayerDTO
    );
    return Promise.resolve(editedPlayer);
  }

  async deleteOne(id: string): Promise<void> {
    await axios.delete(`http://localhost:3000/players/${id}`);
  }

  async findOne(id: string): Promise<Player> {
    const { data } = await axios.get(`http://localhost:3000/players/${id}`);
    return Promise.resolve(data);
  }
}

export class LocallyStoredPlayerService implements PlayerService {
  async getAll() {
    const players = localStorage.getItem("players");

    if (players) return Promise.resolve<Player[]>(JSON.parse(players));

    return Promise.resolve([]);
  }

  async addOne(player: CreatePlayerDTO) {
    const newPlayer = new Player(player);
    const players = await this.getAll();
    localStorage.setItem("players", JSON.stringify([...players, newPlayer]));
    return newPlayer;
  }

  async editOne(playerId: string, editedPlayer: EditPlayerDTO) {
    const players = await this.getAll();
    let playerToEdit = players.find((player) => player.id === playerId);
    // let updatedPlayer: EditPlayerDTO = {};

    if (playerToEdit) {
      // playerToEdit.name = editedPlayer.name;

      // if (editedPlayer.dob) {
      //   updatedPlayer.dob = editedPlayer.dob;
      // }
      // if (editedPlayer.name) {
      //   updatedPlayer.name = editedPlayer.name;
      // }
      // if (editedPlayer.nationality) {
      //   updatedPlayer.nationality = editedPlayer.nationality;
      // }
      // if (editedPlayer.skills) {
      //   updatedPlayer.skills = editedPlayer.skills;
      // }
      localStorage.setItem(
        "players",
        JSON.stringify(
          players.map((player) =>
            player.id === playerId ? { ...player, ...editedPlayer } : player
          )
        )
      );
      return Promise.resolve(playerToEdit);
    }
    return Promise.reject("League not found");
    // let playerIndex = this.players.findIndex((player) => {
    //    return player.id === playerId
    // })

    // this.players[playerIndex] = {
    //     ...this.players[playerIndex], ...updatedPlayer
    // }
    // let players = await this.getAll();
    // this.players = players.map((player) =>
    //   player.id === playerId ? { ...player, ...updatedPlayer } : player
    // );
  }

  async deleteOne(playerId: string) {
    const players = await this.getAll();
    localStorage.setItem(
      "players",
      JSON.stringify(players.filter((player) => player.id !== playerId))
    );
  }

  async findOne(playerId: string) {
    const players = await this.getAll();
    const player = players.find((player) => player.id === playerId);
    if (player) return Promise.resolve<Player>(player);
    return Promise.reject("Player Not found");
  }

  async getPlayer(playerId: string) {
    let players = await this.getAll();
    return Promise.resolve(players.find((player) => player.id === playerId));
  }
}

export class Player {
  public id: string;
  public name: string;
  public nationality: string;
  public dob: string;
  public specialization: string;
  public createdAt: string;

  constructor(createPlayerDTO: CreatePlayerDTO) {
    this.id = uuidv4();
    this.name = createPlayerDTO.name;
    this.nationality = createPlayerDTO.nationality;
    this.specialization = createPlayerDTO.specialization;
    this.dob = createPlayerDTO.dob;
    this.createdAt = new Date().toLocaleString();
  }
}

const playerService = new RestPlayerService();
export default playerService;
