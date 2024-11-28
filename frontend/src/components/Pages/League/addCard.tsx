import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { League } from "./league.js";
import { ReactNode } from "react";

type Props = {
  league: League;
};

export const LeagueCard: React.FC<Props> = ({ league }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>League: {league.name}</CardTitle>
      </CardHeader>
    </Card>
  );
};
