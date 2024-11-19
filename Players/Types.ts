import { RoundBasePrice } from "../Application/Player/types";

export type CreatePlayerDTO = {
  name: string;
  dob: number; //number or string or date
  nationality: string;
  skills: Skill;
};

export type Skill = {
  batter: SkillRating;
  bowler: SkillRating;
  allRounder: SkillRating;
  wicketKeeper: SkillRating;
};

export type EditPlayerDTO = Partial<CreatePlayerDTO>;

type SkillRating = 0 | 1 | 2 | 3 | 4 | 5;

export type CreateApprovedPlayerDTO = {
  playerId: number
  auctionId: number
  roundBasePrice: RoundBasePrice
}