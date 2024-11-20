import { ApprovedPlayer } from "../../Players/playerService";
import { AuctionStatus } from "../Types";
import { BiddingSession } from "./BiddingSession/biddingSession";
import { createRoundDTO } from "./types";

export class Round {
  public readonly id: number;
  public auctionId: number;
  public number: number;
  public static counter: number = 0;
  public poolPlayers: ApprovedPlayer[];
  public status: AuctionStatus;
  public sessions: BiddingSession[];
  public playerOrder: number[];
  public nextPool: ApprovedPlayer[];

  constructor(round: createRoundDTO) {
    Round.counter += 1;
    this.id = Round.counter;
    this.auctionId = round.auctionId;
    this.poolPlayers = round.poolPlayers;
    this.status = "ready";
    this.number = round.number;
    this.sessions = [];
    this.playerOrder = [];
    this.nextPool = [];
  }
}
