import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Card } from "@/components/ui/card";
import AddLeagueForm from "./addForm";
import { useState } from "react";
import { LeagueListCards, LeagueTable } from "./LeagueCardList";
import { Button } from "../ui/button";

export type League = {
  name: string;
};

function League() {
  const [leagues, setLeague] = useState<League[]>([]);
  const [isPopOverOpen, setIsPopOverOpen] = useState(false);

  const handleAddLeague = (newleague: League) => {
    setLeague([...leagues, newleague]);
    setIsPopOverOpen(false);
  };

  return (
    <>
      <div className="flex flex-row justify-between">
        <h1 className="flex justify-start text-xl font-bold">
          League Management
        </h1>
        <div className="flex justify-end">
          <Popover open={isPopOverOpen} onOpenChange={setIsPopOverOpen}>
            <PopoverTrigger>
              <Button>Add League</Button>
            </PopoverTrigger>
            <PopoverContent>
              <Card>
                <AddLeagueForm handleAddLeague={handleAddLeague} />
              </Card>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      {/* <LeagueListCards leagues={leagues} /> */}
      <LeagueTable leagues={leagues} />
    </>
  );
}

export default League;
