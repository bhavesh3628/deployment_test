import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Card } from "@/components/ui/card";
import AddLeagueForm from "./addForm";
import { useState } from "react";
import { LeagueListCards } from "./LeagueCardList";

export type League = {
  name: string;
};

function League() {
  let [leagues, setLeague] = useState<string[]>([]);

  const handleAddLeague = (newleague: string) => {
    setLeague([...leagues, newleague]);
  };

  return (
    <>
      <Popover>
        <PopoverTrigger>Add League</PopoverTrigger>
        <PopoverContent>
          <Card>
            <AddLeagueForm /*handleAddLeague={handleAddLeague}*/ />
          </Card>
        </PopoverContent>
      </Popover>
      <LeagueListCards leagues={leagues} />
    </>
  );
}

export default League;
