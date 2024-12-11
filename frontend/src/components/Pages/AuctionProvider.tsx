import { createContext, useContext } from "react";
import leagueService, { LeagueService } from "./league/league.service";
import editionService, { EditionService } from "./edition/edition.service";
import franchiseService, {
  FranchiseService,
} from "./franchise/franchise.service";

interface AuctionContextInterface {
  leagueService?: LeagueService;
  editionService?: EditionService;
  franchiseService?: FranchiseService;
}
export const AuctionContext = createContext<AuctionContextInterface | null>(
  null
);

const defaultValue = {
  leagueService,
  editionService,
  franchiseService,
};

type AuctionProviderType = {
  children: React.ReactNode;
  value?: AuctionContextInterface;
};

export const AuctionProvider: React.FC<AuctionProviderType> = ({
  children,
  value = defaultValue,
}) => {
  return (
    <AuctionContext.Provider value={value}>{children}</AuctionContext.Provider>
  );
};

// leagues custom hook
export const useLeagues = () => {
  const { leagueService } = useContext(
    AuctionContext
  ) as AuctionContextInterface;
  if (!leagueService) throw new Error("League Context not found");
  return { leagueService };
};

// editions custom hook
export const useEditions = () => {
  const { editionService } = useContext(
    AuctionContext
  ) as AuctionContextInterface;
  if (!editionService) throw new Error("Edition Context not found");
  return { editionService };
};

// franchises custom hook
export const useFranchises = () => {
  const { franchiseService } = useContext(
    AuctionContext
  ) as AuctionContextInterface;
  if (!franchiseService) throw new Error("Franchise Context not found");
  return { franchiseService };
};
