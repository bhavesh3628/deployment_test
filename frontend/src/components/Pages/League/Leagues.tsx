import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Card } from "@/components/ui/card";
import AddLeagueForm from "./addForm";
import { useEffect, useState } from "react";
import { LeagueTable } from "./LeagueTable";
import { Button } from "../../ui/button";
// import { LeagueContext } from "./LeagueProvider";
import { useLeagues } from "../AuctionProvider.js";
import { League } from "./league.service.js";

function LeagueComponent() {
  // localStorage.clear();

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
    setLeagues!(await leagueService!.getAll());
    setPopover(false);
  };
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
    </div>
  );
}

export default LeagueComponent;
