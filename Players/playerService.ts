import { RoundBasePrice } from "../Application/Player/types";
import {
  CreateApprovedPlayerDTO,
  CreatePlayerDTO,
  EditPlayerDTO,
  Skill,
} from "./Types";

export class PlayerService {
  private players: Player[];

  constructor() {
    this.players = [];
  }

  async getAll() {
    return Promise.resolve(this.players);
  }

  async addOne(player: CreatePlayerDTO) {
    let newPlayer = new Player(player);
    let players = await this.getAll();
    this.players = [...players, newPlayer];
    return Promise.resolve(newPlayer);
  }

  async deleteOne(playerId: number) {
    let players = await this.getAll();
    this.players = players.filter((player) => player.id !== playerId);
    return Promise.resolve(true);
  }

  async editOne(playerId: number, editedPlayer: EditPlayerDTO) {
    let updatedPlayer: EditPlayerDTO = {};

    if (editedPlayer.dob) {
      updatedPlayer.dob = editedPlayer.dob;
    }
    if (editedPlayer.name) {
      updatedPlayer.name = editedPlayer.name;
    }
    if (editedPlayer.nationality) {
      updatedPlayer.nationality = editedPlayer.nationality;
    }
    if (editedPlayer.skills) {
      updatedPlayer.skills = editedPlayer.skills;
    }
    // let playerIndex = this.players.findIndex((player) => {
    //    return player.id === playerId
    // })

    // this.players[playerIndex] = {
    //     ...this.players[playerIndex], ...updatedPlayer
    // }
    let players = await this.getAll();
    this.players = players.map((player) =>
      player.id === playerId ? { ...player, ...updatedPlayer } : player
    );
  }

  async getPlayer(playerId: number) {
    let players = await this.getAll();
    return Promise.resolve(players.find((player) => player.id === playerId));
  }
}

export class Player {
  public readonly id: number;
  public readonly name: string;
  public readonly nationality: string;
  public readonly dob: number;
  private static counter: number = 0;
  public readonly skills: Skill;

  constructor(newPlayer: CreatePlayerDTO) {
    Player.counter += 1;
    this.id = Player.counter;
    this.name = newPlayer.name;
    this.nationality = newPlayer.nationality;
    this.skills = newPlayer.skills;
    this.dob = newPlayer.dob;
  }
}

export type SoldStatus = "sold" | "unsold";
export class ApprovedPlayer {
  public readonly playerId: number;
  public id: number;
  private static counter: number = 0;
  public auctionId: number;
  public roundBasePrice: RoundBasePrice;
  public status: SoldStatus;

  constructor(approvedPlayerDTO: CreateApprovedPlayerDTO) {
    ApprovedPlayer.counter += 1;
    this.id = ApprovedPlayer.counter;
    this.playerId = approvedPlayerDTO.playerId;
    this.auctionId = approvedPlayerDTO.auctionId;
    this.roundBasePrice = approvedPlayerDTO.roundBasePrice;
    this.status = "unsold";
  }
}
