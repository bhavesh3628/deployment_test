import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Card } from "@/components/ui/card";
import AddLeagueForm from "./AddForm.js";
import { useEffect, useState } from "react";
import { LeagueTable } from "./LeagueTable.js";
import { Button } from "../../ui/button.js";
import leagueService, { League } from "./league.service.js";

function LeagueComponent() {
  // change leagues state on API call success

  const [leagues, setLeagues] = useState<League[]>([]);
  useEffect(() => {
    const fetchLeagues = async () => {
      try {
        const leagues = await leagueService.getAll();
        setLeagues(leagues);
      } catch (error) {
        console.error("Failed to fetch leagues:", error);
      }
    };

    fetchLeagues();
  }, []);

  const [isPopoverOpen, setPopover] = useState(false);

  const handleAddLeague = async () => {
    // refresh league list
    // const updatedLeagues = [...leagues];
    // updatedLeagues.unshift(newLeague)
    setLeagues(await leagueService.getAll());
    setPopover(false);
  };

  useEffect(() => {
    localStorage.setItem("leagues", JSON.stringify(leagues));
  }, [leagues]);

  return (
    <div className="w-full m-1">
      <div className="flex flex-row justify-between">
        <h1 className="flex justify-start text-xl font-bold">
          League Management
        </h1>
        <div className="flex justify-center">
          <Popover open={isPopoverOpen} onOpenChange={setPopover}>
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
        <LeagueTable leagues={leagues} setLeagues={setLeagues} />
      </div>
      {/* <LeagueListCards leagues={leagues} /> */}
    </div>
  );
}

export default LeagueComponent;
