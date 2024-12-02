import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect, useState } from "react";
import AddEditionForm from "./AddForm";
import editionService, { Edition } from "./edition.service";
import { EditionTable } from "./EditionTable";
import leagueService, { League } from "../league/league.service";

export type EditionWithLeagues = {
  league: League | undefined;
  leagueId: number;
  name: string;
  id: number;
  auctionId?: number;
};

export const EditionComponent = () => {
  let [editionWithLeagues, setEditionWithLeagues] = useState<
    EditionWithLeagues[]
  >([]);
  const leagues = JSON.parse(localStorage.getItem("leagues")!) ?? [
    {
      name: "hi",
      id: 1,
      editions: [],
      createdAt: "02/12/2024, 11:54:21",
    },
  ];
  const [isPopOverOpen, setIsPopOverOpen] = useState(false);
  const [editions, setEditions] = useState<Edition[]>([]);

  const handleAddEdition = async () => {
    // refresh league list
    // const updatedLeagues = [...leagues];
    // updatedLeagues.unshift(newLeague)
    setEditions(await editionService.getAll());
    setIsPopOverOpen(false);
    fetchEditions();
  };

  const fetchEditions = async () => {
    try {
      const editions = await editionService.getAll();
      const leagues = await leagueService.getAll();
      let newEditions: EditionWithLeagues[] = editions.map((edition) => {
        const league = leagues.find((league) => league.id === edition.leagueId);
        return { ...edition, league };
      });
      setEditionWithLeagues(newEditions);
      // setEditions(editions);
    } catch (error) {
      console.error("Failed to fetch editions:", error);
    }
  };

  useEffect(() => {
    fetchEditions();
  }, []);
  return (
    <>
      <div className="w-full m-1">
        <div className="flex flex-row justify-between">
          <h1 className="flex justify-start text-xl font-bold">
            Edition Management
          </h1>
          <div className="flex justify-center">
            <Popover open={isPopOverOpen} onOpenChange={setIsPopOverOpen}>
              <PopoverTrigger>
                <Button>Add Edition</Button>
              </PopoverTrigger>
              <PopoverContent>
                <Card>
                  <AddEditionForm
                    handleAddEdition={handleAddEdition}
                    leagues={leagues}
                  />
                </Card>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="block">
          <EditionTable
            editionWithLeagues={editionWithLeagues}
            setEditions={setEditions}
          />
        </div>
      </div>
    </>
  );
};
export { Edition };
