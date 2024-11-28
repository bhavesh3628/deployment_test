import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Card } from "@/components/ui/card";
import AddLeagueForm from "./addForm.js";
import { useState } from "react";
import { LeagueListCards, LeagueTable } from "./LeagueTable.js";
import { Button } from "../../ui/button.js";

export type League = {
  id: number;
  name: string;
  createdAt: string;
};

function League() {
  const [leagues, setLeague] = useState<League[]>([]);
  const [isPopOverOpen, setIsPopOverOpen] = useState(false);

  const handleAddLeague = (newleague: League) => {
    setLeague([...leagues, newleague]);
    setIsPopOverOpen(false);
  };

  return (
    <div className="w-full m-1">
      <div className="flex flex-row justify-between">
        <h1 className="flex justify-start text-xl font-bold">
          League Management
        </h1>
        <div className="flex justify-center">
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
      <div className="block">
        <LeagueTable leagues={leagues} />
      </div>
      {/* <LeagueListCards leagues={leagues} /> */}
    </div>
  );
}

export default League;
