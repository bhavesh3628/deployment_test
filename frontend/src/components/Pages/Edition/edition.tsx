import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect, useState } from "react";
import AddEditionForm from "./AddForm";
import editionService, { Edition } from "./edition.service";
import { EditionTable } from "./EditionTable";
import { League } from "../league/league.service";
import { useLeagues } from "../AuctionProvider";

export type EditionWithLeagues = {
  league: League | undefined;
  leagueId: number;
  name: string;
  id: number;
  auctionId?: number;
};

const EditionComponent = () => {
  const { leagueService } = useLeagues();
  let [editionWithLeagues, setEditionWithLeagues] = useState<
    EditionWithLeagues[]
  >([]);
  const [isPopOverOpen, setIsPopOverOpen] = useState(false);
  const [editions, setEditions] = useState<Edition[]>([]);

  const handleAddEdition = async () => {
    setEditions(await editionService.getAll());
    setIsPopOverOpen(false);
  };

  useEffect(() => {
    const fetchEditions = async () => {
      try {
        const editions = await editionService.getAll();
        const leagues = await leagueService.getAll();
        let newEditions: EditionWithLeagues[] = editions.map((edition) => {
          const league = leagues.find(
            (league) => league.id === edition.leagueId
          );
          return { ...edition, league };
        });
        setEditionWithLeagues(newEditions);
        // setEditions(editions);
      } catch (error) {
        console.error("Failed to fetch editions:", error);
      }
    };

    fetchEditions();
  }, [editions]);
  return (
    <>
      <div className="w-full m-4">
        <div className="flex flex-row justify-between">
          <h1 className="flex justify-start text-xl font-bold">
            Edition Management
          </h1>
          <div className="flex justify-center">
            <Popover open={isPopOverOpen} onOpenChange={setIsPopOverOpen}>
              <PopoverTrigger>
                <Button>Add Edition</Button>
              </PopoverTrigger>
              <PopoverContent className="mr-4">
                <AddEditionForm handleAddEdition={handleAddEdition} />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="block">
          <EditionTable
            editionWithLeagues={editionWithLeagues}
            setEdition={setEditions}
          />
        </div>
      </div>
    </>
  );
};
export default EditionComponent;
