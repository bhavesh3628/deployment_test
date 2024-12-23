import { Button } from "@/components/ui/button";
import {
  AlertDialogHeader,
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog.js";

const PlayerApplicationComponent = () => {
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
                  <AlertDialogDescription></AlertDialogDescription>
                </AlertDialogHeader>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </>
  );
};
export default PlayerApplicationComponent;
