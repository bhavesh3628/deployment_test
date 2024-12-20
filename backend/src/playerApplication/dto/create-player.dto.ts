export type RoundBasePrice = { [key: number]: number };

export type CreatePlayerApplicationDTO = {
  playerId: string;
  auctionId: string;
  roundBasePrice: RoundBasePrice;
};
