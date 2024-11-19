
import { createBiddingSessionDTO, CreateBidDTO } from "./types";

// export 

export class BiddingSession {
  public id: number;
  public static counter: number = 0;
  public playerId: number;
  public bids: Bid[];
  public auctionId: number
  public status: "completed"|"not-started"|"started"

  constructor(biddingSession:createBiddingSessionDTO) {
    BiddingSession.counter +=1
    this.id = BiddingSession.counter
    this.playerId = biddingSession.playerId
    this.auctionId = biddingSession.auctionId
    this.bids = []
    this.status = "not-started"
  }
}

export class Bid {
  public id: number;
  public static counter: number = 0;
  public franchiseId: number;
  public biddingSessionId: number;
  public amount: number;
  public createdAt: number;
  public status: "accepted"|"rejected"|"created"

  constructor(bid: CreateBidDTO) {
    Bid.counter += 1
    this.id = Bid.counter
    this.amount = bid.amount;
    this.biddingSessionId = bid.biddingSessionId;
    this.createdAt = Date.now();
    this.franchiseId = bid.franchiseId;
    this.status = "created"
  }
}
