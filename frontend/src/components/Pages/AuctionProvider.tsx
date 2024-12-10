import { createContext, useContext } from "react";
import leagueService, { LeagueService } from "./league/league.service.js";
import editionService, { EditionService } from "./edition/edition.service.js";

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
  if (!leagueService) throw new Error("League Context not found");
  return { leagueService };
};

export const useEditions = () => {
  const { editionService } = useContext(
    AuctionContext
  ) as AuctionContextInterface;
  if (!editionService) throw new Error("Edition Context not found");
  return { editionService };
};
