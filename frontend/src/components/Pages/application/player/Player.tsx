import { Button } from "@/components/ui/button";

import { useEffect, useState } from "react";
// import { EditionTable } from "./EditionTable.jsx";
import { PlayerApplication } from "./application.service.js";
import { usePlayerApplications } from "../../AuctionProvider";
import AddApplicationForm from "./addForm";
import {
  AlertDialogHeader,
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog.js";

const PlayerApplicationComponent = () => {
  const [applications, setApplications] = useState<PlayerApplication[]>([]);
  const [isPopoverOpen, setPopover] = useState(false);

  const { playerApplicationService } = usePlayerApplications();

  useEffect(() => {
    const fetchPlayerApplications = async () => {
      try {
        const updatedPlayers = await playerApplicationService.getAll();
        setApplications(updatedPlayers);
      } catch (error) {
        console.error("Failed to fetch Player Applications:", error);
      }
    };

    fetchPlayerApplications();
  }, []);

  const handleAddApplications = async () => {
    setApplications(await playerApplicationService.getAll());
    setPopover(false);
  };
  // what fields do i need for the application
  /* 1. name
      2. round base price
      3. for which auction   
   */
  return (
    <>
      <div className="w-full m-4">
        <div className="flex flex-row justify-between">
          <h1 className="flex justify-start text-xl font-bold">
            Player Application Management
          </h1>
          <div className="flex justify-center">
            {/* <Popover open={isPopoverOpen} onOpenChange={setPopover}>
              <PopoverTrigger>
                <Button>Register For Auction</Button>
              </PopoverTrigger>
              <PopoverContent className="mr-4">
                <AddApplicationForm
                  handleAddApplication={handleAddApplications}
                />
              </PopoverContent>
            </Popover> */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button>Register</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Player Registration Form</AlertDialogTitle>
                  <AlertDialogDescription>
                    <AddApplicationForm
                      handleAddApplication={handleAddApplications}
                    />
                  </AlertDialogDescription>
                </AlertDialogHeader>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        <div className="block">
          {/* <EditionTable
            // editionWithLeagues={applications}
            setEdition={setEditions}
          /> */}
        </div>
      </div>
    </>
  );
};
export default PlayerApplicationComponent;
