export type CreateAuctionDTO = {
    editionId: number;
    purse: number;
    numberOfRounds: number;
    coolDownPeriod: number; // in seconds
    plannedStartDate: string;
    maxRetention?: number;
  };
  
  export type AuctionStatus = "started"|"concluded"|"halted"|"ready"
  