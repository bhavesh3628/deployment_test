export type Status = "accepted" | "rejected" | "pending";
export type RoundBasePrice = { [key: number]: number };
export type CreatePlayerApplicationDTO = {
  playerId: string;
  auctionId: string;
  roundBasePrice: RoundBasePrice;
};

export type EditPlayerApplicationDTO = {
  roundBasePrice: RoundBasePrice;
};
export type PlayerApplicationMeta = {
  authorizedOn: string;
  authorizedBy: number;
  comment: string;
};

export type CreateApprovedPlayerDTO = {
  playerId: number;
  auctionId: number;
  roundBasePrice: RoundBasePrice;
};
