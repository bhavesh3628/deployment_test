export type Status = "accepted" | "rejected" | "pending";
export type CreateFranchiseApplicationDTO = {
  franchiseId: number;
  auctionId: number;
  purse: number;
  meta?:FranchiseApplicationMeta
  status: Status
};

export type EditFranchiseApplicationDTO = {
  purse: number;
};
export type FranchiseApplicationMeta = {
  authorizedOn: string,
  authorizedBy: number,
  comment: string
}
