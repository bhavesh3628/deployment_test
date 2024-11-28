import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";

export type Edition = {
  name: string;
  leagueId: number;
  id: number;
};

export const Edition = () => {
  const [isPopOverOpen, setIsPopOverOpen] = useState(false);
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
                <Button>Add League</Button>
              </PopoverTrigger>
              <PopoverContent>
                <Card>
                  {/* <AddEditionForm handleAddEdition={handleAddEdition} /> */}
                </Card>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="block">{/* <EditionTable Edition={Editions} /> */}</div>
        {/* <LeagueListCards leagues={leagues} /> */}
      </div>
    </>
  );
};
