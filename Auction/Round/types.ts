import { ApprovedPlayer } from "../../Players/playerService";

export type createRoundDTO = {
   auctionId: number;
   poolPlayers: ApprovedPlayer[];
   number: number
}