import { LeagueCard } from "./addCard";
import { League } from "./league";

type handleLeagueProps = {
  leagues: League[];
};

export const LeagueListCards = ({ leagues }: handleLeagueProps) => {
  return (
    <>
      {leagues.map((league) => (
        <LeagueCard league={league} />
      ))}
    </>
  );
};
