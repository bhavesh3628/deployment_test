import { createContext, useContext, useState } from "react";
import leagueService, {
  League,
  LeagueService,
} from "./league/league.service.js";
import editionService, {
  Edition,
  EditionService,
} from "./edition/edition.service.js";

interface AuctionContextInterface {
  leagueService?: LeagueService;
  editionService?: EditionService;
}
export const AuctionContext = createContext<AuctionContextInterface | null>(
  null
);

export const AuctionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <AuctionContext.Provider
      value={{
        leagueService,
        editionService,
      }}
    >
      {children}
    </AuctionContext.Provider>
  );
};
export const useLeagues = () => {
  const { leagueService } = useContext(
    AuctionContext
  ) as AuctionContextInterface;
  if (!leagueService) throw new Error("Context not found");
  return { leagueService };
};
