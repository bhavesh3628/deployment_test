
export type CreateBidDTO = {
    franchiseId:number,
    biddingSessionId:number,
    amount:number,
    createdAt: number,
    auctionId: number
   

  }

  export type createBiddingSessionDTO = {
    playerId: number;
    auctionId: number
  }