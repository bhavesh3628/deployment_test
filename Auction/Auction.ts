import {
  FranchiseApplication,
  FranchiseApplicationService,
} from "../Application/Franchise/application";
import {
  CreateFranchiseApplicationDTO,
  FranchiseApplicationMeta,
} from "../Application/Franchise/types";
import { PlayerApplication } from "../Application/Player/application";
import { PlayerApplicationMeta, Status } from "../Application/Player/types";
import { ApprovedPlayer, Player } from "../Players/playerService";
import { CreateApprovedPlayerDTO } from "../Players/Types";
import { RegisteredFranchise } from "./RegisteredFranchise/RegisteredFranchise";
import { CreateRegisteredFranchiseDTO } from "./RegisteredFranchise/types";
import { Bid, BiddingSession } from "./Round/BiddingSession/biddingSession";
import {
  createBiddingSessionDTO,
  CreateBidDTO,
} from "./Round/BiddingSession/types";
import { Round } from "./Round/round";
import { createRoundDTO } from "./Round/types";
import { AuctionStatus, CreateAuctionDTO } from "./Types";

export class AuctionService {
  private auctions: Auction[];
  constructor() {
    this.auctions = [];
  }

  async getAll() {
    return Promise.resolve(this.auctions);
  }

  async addOne(auctionDTO: CreateAuctionDTO) {
    let auction = new Auction(auctionDTO);
    let auctions = await this.getAll();
    this.auctions = [...auctions, auction];
    return Promise.resolve(auction);
  }

  async addToPlayerPool(approvedPlayer: ApprovedPlayer) {
    let auctions = await this.getAll();
    let auction = auctions.find(
      (auction) => auction.id === approvedPlayer.auctionId
    );
    if (auction) {
      auction.poolPlayers = [...auction.poolPlayers, approvedPlayer];
    }
  }

  async addToRegisteredFranchise(
    registeredFranchise: CreateRegisteredFranchiseDTO
  ) {
    let auction = await this.getAuction(registeredFranchise.auctionId);
    if (auction) {
      let newRegisteredFranchise = new RegisteredFranchise(registeredFranchise);
      auction.registeredFranchises = [
        ...auction.registeredFranchises,
        newRegisteredFranchise,
      ];
      return Promise.resolve(newRegisteredFranchise);
    } else return Promise.reject("Invalid auction for franchise");
  }

  async processPlayerApplication(
    application: PlayerApplication,
    meta: PlayerApplicationMeta,
    status: Status
  ) {
    application.applicationMeta = meta;
    application.status = status;
    if (application.status === "accepted") {
      let approvedPlayerDTO: CreateApprovedPlayerDTO = {
        playerId: application.playerId,
        auctionId: application.auctionId,
        roundBasePrice: application.roundBasePrice,
      };
      let approvedPlayer = new ApprovedPlayer(approvedPlayerDTO);
      this.addToPlayerPool(approvedPlayer);
      return Promise.resolve(application);
    } else return Promise.reject("application is rejected");
  }

  async processFranchiseApplication(
    application: FranchiseApplication,
    meta: FranchiseApplicationMeta,
    status: Status
  ) {
    application.applicationMeta = meta;
    application.status = status;
    if (application.status === "accepted") {
      let registeredFranchiseDTO: CreateRegisteredFranchiseDTO = {
        franchiseId: application.franchiseId,
        auctionId: application.auctionId,
        purse: application.purse,
      };
      let franchiseApplication = new RegisteredFranchise(
        registeredFranchiseDTO
      );
      this.addToRegisteredFranchise(franchiseApplication);
      return Promise.resolve(application);
    } else return Promise.reject("application is rejected!");
  }

  private async startRound(auction: Auction) {
    let newRoundDTO: createRoundDTO = {
      auctionId: auction.id,
      poolPlayers: auction.poolPlayers.filter(
        (player) => player.status === "unsold"
      ),
      number: auction.rounds.length + 1,
    };
    let newRound = new Round(newRoundDTO);
    newRound.status = "started";
    auction.rounds = [...auction.rounds, newRound];
    return Promise.resolve(this.startSession(newRound));
  }

  async stopRound(round: Round) {
    round.status = "concluded";
    let auction = await this.getAuction(round.auctionId);
    if (auction.numberOfRounds === auction.rounds.length) {
      await this.stopAuction(auction.id);
      return Promise.resolve(round);
    } else Promise.reject("round is not stopped");
  }

  async stopAuction(auctionId: number) {
    let auction = await this.getAuction(auctionId);
    auction.status = "concluded";
    return Promise.resolve(auction.poolPlayers);
  }

  async startSession(round: Round) {
    let playerIndex = await this.getRandomPlayerId(round);
    let player = round.poolPlayers[playerIndex];
    const auction = await this.getAuction(round.auctionId);
    let newBiddingSessionDTO: createBiddingSessionDTO = {
      playerId: player.id, //duplicates
      auctionId: auction.id,
    };
    let newSession = new BiddingSession(newBiddingSessionDTO);
    newSession.status = "started";
    round.sessions = [...round.sessions, newSession];

    return Promise.resolve(newSession);
  }

  async stopSession(biddingSession: BiddingSession) {
    let auction = await this.getAuction(biddingSession.auctionId);
    let round = auction.rounds.find((round) => round.status === "started");
    let poolPlayer = await this.getPoolPlayer(
      auction.id,
      biddingSession.playerId
    );

    if (round) {
      let roundPlayer = round.poolPlayers.find(
        (player) => player.id === biddingSession.playerId
      );
      biddingSession.status = "completed";
      if (biddingSession.bids.length > 0) {
        poolPlayer.status = "sold";
        if (roundPlayer) {
          roundPlayer.status = "sold";
        }

        let lastBid = biddingSession.bids[biddingSession.bids.length - 1];
        let winningFranchise = await this.getRegisteredFranchise(
          auction.id,
          lastBid.franchiseId
        );
        if (winningFranchise) {
          winningFranchise.purse -= lastBid.amount; //wrap into franchise manipulation functions
          winningFranchise.team = [
            ...winningFranchise.team,
            biddingSession.playerId,
          ];
        }
        if (round.sessions.length === round.poolPlayers.length) {
          this.stopRound(round);
        } else return Promise.resolve(this.startSession(round));
      }
    } else return Promise.reject("round not found");
  }

  // doubt - private functions
  private async getRandomPlayerId(round: Round): Promise<number> {
    let randomId: number;
    if (round.poolPlayers.length === 0) return -1;
    else if (round.poolPlayers.length === 1) return 0;
    else
      randomId = Math.floor(Math.random() * (round.poolPlayers.length - 1) + 1);

    if (!round.playerOrder.includes(randomId)) {
      round.playerOrder = [...round.playerOrder, randomId];
      console.log(round.playerOrder);
      return Promise.resolve(randomId);
    } else return Promise.reject(this.getRandomPlayerId(round));
  }

  async start(auctionId: number) {
    let auction = await this.getAuction(auctionId);
    auction.status = "started";
    return Promise.resolve(this.startRound(auction));
  }

  async getAuction(auctionId: number) {
    let auction = this.auctions.find((auction) => auction.id === auctionId);
    if (!auction) {
      return Promise.reject("auction not found");
    }
    return Promise.resolve(auction);
  }
  async getWinningBid(biddingSessionId: number) {
    let auction = this.auctions.find((auction) =>
      auction.rounds.find((round) =>
        round.sessions.find((session) => session.id === biddingSessionId)
      )
    );
    if (!auction) Promise.reject("auction not found");
    else {
      let round = auction.rounds.find((round) =>
        round.sessions.find((session) => session.id === biddingSessionId)
      );
      if (!round) Promise.reject("round not found");
      else {
        let biddingSession = round.sessions.find(
          (session) => session.id === biddingSessionId
        );
        if (!biddingSession) Promise.reject("bidding session not found");
        else {
          let lastBid = biddingSession.bids[biddingSession.bids.length - 1];
          return Promise.resolve(lastBid);
        }
      }
    }
  }
  async getRegisteredFranchise(auctionId: number, franchiseId: number) {
    let auction = await this.getAuction(auctionId);

    let registeredFranchise = auction.registeredFranchises.find(
      (franchise) => franchise.franchiseId === franchiseId
    );
    if (!registeredFranchise) Promise.reject("franchise is not registered");
    return Promise.resolve(registeredFranchise);
  }
  async getPoolPlayer(auctionId: number, playerId: number) {
    let auction = await this.getAuction(auctionId);
    let poolPlayer = auction.poolPlayers.find(
      (poolPlayer) => poolPlayer.playerId === playerId
    );
    if (!poolPlayer) return Promise.reject("pool player is not registered");
    return Promise.resolve(poolPlayer);
  }

  async bid(bidDTO: CreateBidDTO) {
    let auction = await this.getAuction(bidDTO.auctionId);
    if (auction.status === "started") {
      // find round
      let round = auction.rounds.find((round) => round.status === "started");
      if (round) {
        // find biddingSession
        let currentBiddingSession = round.sessions.find(
          (session) => session.id === bidDTO.biddingSessionId
        );
        if (currentBiddingSession) {
          let newBid = new Bid(bidDTO);
          // find poolplayers
          let player = auction.poolPlayers.find(
            (player) => player.id === currentBiddingSession.playerId
          );
          if (player) {
            if (player.roundBasePrice[round.number] > newBid.amount) {
              newBid.status = "rejected";
              return Promise.resolve(newBid);
            } else {
              if (
                //wrap validation
                currentBiddingSession.bids.length !== 0 &&
                currentBiddingSession.bids[
                  currentBiddingSession.bids.length - 1
                ].amount < newBid.amount
              ) {
                newBid.status = "accepted";
                currentBiddingSession.bids = [
                  ...currentBiddingSession.bids,
                  newBid,
                ];
                return Promise.resolve(newBid); // returning bid if it is added
              } else if (currentBiddingSession.bids.length === 0) {
                newBid.status = "accepted";
                currentBiddingSession.bids = [
                  ...currentBiddingSession.bids,
                  newBid,
                ];
                return newBid;
              } else {
                newBid.status = "rejected";
                return Promise.resolve(newBid);
              }
            }
          }
          return Promise.reject("Player does not exist in session!!");
        }
        return Promise.reject("Session does not exist!!!");
      }
      return Promise.reject("Round not found!!!");
    }
    return Promise.reject("Auction is not started yet");
  }
}

export class Auction {
  private static counter: number = 0;
  public readonly id: number;
  public readonly editionId: number;
  public purse: number;
  public rounds: Round[];
  public readonly coolDownPeriod: number;
  public readonly plannedStartDate: string;
  public readonly maxRetention?: number;
  public readonly numberOfRounds: number;
  public poolPlayers: ApprovedPlayer[];

  public registeredFranchises: RegisteredFranchise[];
  public status: AuctionStatus;
  constructor(auctionDTO: CreateAuctionDTO) {
    Auction.counter += 1;
    this.id = Auction.counter;
    this.editionId = auctionDTO.editionId;
    this.coolDownPeriod = auctionDTO.coolDownPeriod;
    this.purse = auctionDTO.purse;
    this.numberOfRounds = auctionDTO.numberOfRounds;
    this.plannedStartDate = auctionDTO.plannedStartDate;
    this.poolPlayers = [];
    this.rounds = [];
    this.registeredFranchises = [];
    this.status = "ready";
  }
}
