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

  getAll() {
    return this.auctions;
  }

  addOne(auctionDTO: CreateAuctionDTO) {
    let auction = new Auction(auctionDTO);
    this.auctions = [...this.auctions, auction];
    return auction;
  }

  addToPlayerPool(approvedPlayer: ApprovedPlayer) {
    let auction = this.auctions.find(
      (auction) => auction.id === approvedPlayer.auctionId
    );
    if (auction) {
      auction.poolPlayers = [...auction.poolPlayers, approvedPlayer];
    }
  }

  addToRegisteredFranchise(registeredFranchise: CreateRegisteredFranchiseDTO) {
    let auction = this.auctions.find(
      (auction) => auction.id === registeredFranchise.auctionId
    );
    if (auction) {
      let newRegisteredFranchise = new RegisteredFranchise(registeredFranchise);
      auction.registeredFranchises = [
        ...auction.registeredFranchises,
        newRegisteredFranchise,
      ];
      return newRegisteredFranchise;
    }
  }

  processPlayerApplication(
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
    }
    return application;
  }

  processFranchiseApplication(
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
    }
    return application;
  }

  private startRound(auction: Auction) {
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
    return this.startSession(newRound);
  }

  stopRound(round: Round) {
    round.status = "concluded";
    let auction = this.getAuction(round.auctionId);
    if (auction.numberOfRounds === auction.rounds.length)
      this.stopAuction(auction.id);
    return round;
  }

  stopAuction(auctionId: number) {
    let auction = this.getAuction(auctionId);
    auction.status = "concluded";
    return auction.poolPlayers;
  }

  startSession(round: Round) {
    console.log("in startSession");
    let playerIndex = this.getRandomPlayerId(round);
    let player = round.poolPlayers[playerIndex];
    let newBiddingSessionDTO: createBiddingSessionDTO = {
      playerId: player.id, //duplicates
      auctionId: this.getAuction(round.auctionId).id,
    };
    let newSession = new BiddingSession(newBiddingSessionDTO);
    newSession.status = "started";
    round.sessions = [...round.sessions, newSession];
    console.log(newSession);

    return newSession;
  }

  stopSession(biddingSession: BiddingSession) {
    let auction = this.getAuction(biddingSession.auctionId);
    let round = auction.rounds.find((round) => round.status === "started");
    let poolPlayer = this.getPoolPlayer(auction.id, biddingSession.playerId);

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
        let winningFranchise = this.getRegisteredFranchise(
          auction.id,
          lastBid.franchiseId
        );

        winningFranchise.purse -= lastBid.amount; //wrap into franchise manipulation functions
        winningFranchise.team = [
          ...winningFranchise.team,
          biddingSession.playerId,
        ];
        if (round.sessions.length === round.poolPlayers.length) {
          this.stopRound(round);
        } else return this.startSession(round);
      }
    }
  }

  private getRandomPlayerId(round: Round): number {
    let randomId: number;
    if (round.poolPlayers.length === 0) return -1;
    else if (round.poolPlayers.length === 1) return 0;
    else
      randomId = Math.floor(Math.random() * (round.poolPlayers.length - 1) + 1);

    if (!round.playerOrder.includes(randomId)) {
      round.playerOrder = [...round.playerOrder, randomId];
      console.log(round.playerOrder);
      return randomId;
    } else return this.getRandomPlayerId(round);
  }

  start(auctionId: number) {
    let auction = this.getAuction(auctionId);
    if (!auction) throw new Error("Auction not found");
    auction.status = "started";
    console.log("in start auction");
    return this.startRound(auction);
  }

  getAuction(auctionId: number): Auction {
    let auction = this.auctions.find((auction) => auction.id === auctionId);
    if (!auction) {
      throw new Error("auction not found");
    }
    return auction;
  }
  getWinningBid(biddingSessionId: number) {
    let auction = this.auctions.find((auction) =>
      auction.rounds.find((round) =>
        round.sessions.find((session) => session.id === biddingSessionId)
      )
    );
    if (!auction) throw new Error("auction not found");
    let round = auction.rounds.find((round) =>
      round.sessions.find((session) => session.id === biddingSessionId)
    );
    if (!round) throw new Error("round not found");
    let biddingSession = round.sessions.find(
      (session) => session.id === biddingSessionId
    );
    if (!biddingSession) throw new Error("bidding session not found");
    let lastBid = biddingSession.bids[biddingSession.bids.length - 1];
    return lastBid;
  }
  getRegisteredFranchise(auctionId: number, franchiseId: number) {
    let auction = this.getAuction(auctionId);

    let registeredFranchise = auction.registeredFranchises.find(
      (franchise) => franchise.franchiseId === franchiseId
    );
    if (!registeredFranchise) throw new Error("franchise is not registered");
    return registeredFranchise;
  }
  getPoolPlayer(auctionId: number, playerId: number) {
    let auction = this.getAuction(auctionId);
    let poolPlayer = auction.poolPlayers.find(
      (poolPlayer) => poolPlayer.playerId === playerId
    );
    if (!poolPlayer) throw new Error("pool player is not registered");
    return poolPlayer;
  }

  bid(bidDTO: CreateBidDTO) {
    let auction = this.getAuction(bidDTO.auctionId);
    if (auction.status === "started") {
      let round = auction.rounds.find((round) => round.status === "started");
      if (round) {
        let currentBiddingSession = round.sessions.find(
          (session) => session.id === bidDTO.biddingSessionId
        );
        if (currentBiddingSession) {
          let newBid = new Bid(bidDTO);
          let player = auction.poolPlayers.find(
            (player) => player.id === currentBiddingSession.playerId
          );
          if (player) {
            if (player.roundBasePrice[round.number] > newBid.amount) {
              newBid.status = "rejected";
              console.log(newBid);
              return newBid;
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
                return newBid; // returning bid if it is added
              } else if (currentBiddingSession.bids.length === 0) {
                newBid.status = "accepted";
                currentBiddingSession.bids = [
                  ...currentBiddingSession.bids,
                  newBid,
                ];
                return newBid;
              } else {
                newBid.status = "rejected";
                return newBid;
              }
            }
          }
          throw new Error("Player does not exist in session!!");
        }
        throw new Error("Session does not exist!!!");
      }
      throw new Error("Round not found!!!");
    }
    throw new Error("Auction is not started yet");
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
