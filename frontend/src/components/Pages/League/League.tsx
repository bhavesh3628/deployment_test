import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import AddLeagueForm from "./AddForm.js";
import { useEffect, useState } from "react";
import { LeagueTable } from "./LeagueTable.js";
import { Button } from "../../ui/button.js";
import { useLeagues } from "../AuctionProvider.js";
import { League } from "./league.service.js";

function LeagueComponent() {
  const [leagues, setLeagues] = useState<League[]>([]);
  const { leagueService } = useLeagues();
  useEffect(() => {
    const fetchLeagues = async () => {
      try {
        const updatedLeagues = await leagueService.getAll();
        setLeagues(updatedLeagues);
      } catch (error) {
        console.error("Failed to fetch leagues:", error);
      }
    };

    fetchLeagues();
  }, []);

  const [isPopoverOpen, setPopover] = useState(false);

  const handleAddLeague = async () => {
    setLeagues(await leagueService.getAll());
    setPopover(false);
  };
  return (
    <div className="w-full m-4">
      <div className="flex flex-row justify-between">
        <h1 className="flex justify-start text-xl font-bold">
          League Management
        </h1>
        <div className="flex justify-center">
          <Popover open={isPopoverOpen} onOpenChange={setPopover}>
            <PopoverTrigger>
              <Button>Add League</Button>
            </PopoverTrigger>
            <PopoverContent className="mr-4">
              <AddLeagueForm handleAddLeague={handleAddLeague} />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="block">
        <LeagueTable leagues={leagues} setLeagues={setLeagues} />
      </div>
    </div>
  );
}

export default LeagueComponent;
