// import { RoundBasePrice } from "../Application/Player/types";

export type CreatePlayerDTO = {
  name: string;
  dob: string; //number or string or date
  nationality: string;
  specialization: string;
};
// Skill = 'Batter' | 'Bowler' | 'All Rounder' | 'Wicket Keeper'
export type Skill = {
  batter: number;
  bowler: number;
  allRounder: number;
  wicketkeeper: number;
};

export type EditPlayerDTO = Partial<CreatePlayerDTO>;

// export type SkillRating = 0 | 1 | 2 | 3 | 4 | 5;

// export type CreateApprovedPlayerDTO = {
//   playerId: number
//   auctionId: number
//   roundBasePrice: RoundBasePrice
// }
