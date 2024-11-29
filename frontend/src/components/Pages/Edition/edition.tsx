import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import AddEditionForm from "./AddForm";
import editionService, { Edition } from "./edition.service";
import { EditionTable } from "./EditionTable";

export const EditionComponent = () => {
  const [isPopOverOpen, setIsPopOverOpen] = useState(false);
  const [editions, setEditions] = useState(editionService.getAll());
  const handleAddEdition = (newEdition: Edition) => {
    // refresh league list
    // const updatedLeagues = [...leagues];
    // updatedLeagues.unshift(newLeague)
    setEditions(editionService.getAll());
    setIsPopOverOpen(false);
  };
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
                  <AddEditionForm handleAddEdition={handleAddEdition} />
                </Card>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="block">
          <EditionTable editions={editions} setEditions={setEditions} />
        </div>
      </div>
    </>
  );
};
export { Edition };
