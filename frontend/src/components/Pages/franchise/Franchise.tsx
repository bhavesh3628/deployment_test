import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@radix-ui/react-popover";
import { useState, useEffect } from "react";
import { Franchise } from "./franchise.service";
import { useFranchises } from "../AuctionProvider";
import AddFranchiseForm from "./AddForm";
import { FranchiseTable } from "./FranchiseTable.jsx";

const FranchiseComponent = () => {
  const [isPopOverOpen, setIsPopOverOpen] = useState(false);
  const [franchises, setFranchises] = useState<Franchise[]>([]);
  const { franchiseService } = useFranchises();

  const handleAddFranchises = async () => {
    setFranchises(await franchiseService.getAll());
    setIsPopOverOpen(false);
  };

  useEffect(() => {
    const fetchFranchises = async () => {
      try {
        const fetchedFranchises = await franchiseService.getAll();
        setFranchises(fetchedFranchises);
      } catch (error) {
        console.error("Failed to fetch franchises:", error);
      }
    };

    fetchFranchises();
    console.log(franchises);
  }, []);
  // useEffect
  return (
    <>
      <div className="w-full m-4">
        <div className="flex flex-row justify-between">
          <h1 className="flex justify-start text-xl font-bold">
            Franchise Management
          </h1>
          <div className="flex justify-center">
            <Popover open={isPopOverOpen} onOpenChange={setIsPopOverOpen}>
              <PopoverTrigger>
                <Button>Add Franchise</Button>
              </PopoverTrigger>
              <PopoverContent className="mr-4">
                <AddFranchiseForm handleAddFranchise={handleAddFranchises} />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="block">
          <FranchiseTable
            franchises={franchises}
            setFranchises={setFranchises}
          />
        </div>
      </div>
    </>
  );
};

export default FranchiseComponent;
