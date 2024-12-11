import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Button } from "../../ui/button.jsx";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover.js";
import { Card } from "@/components/ui/card.js";
import { useState } from "react";
import { Franchise } from "./franchise.service.js";
import { useFranchises } from "../AuctionProvider.jsx";
import EditFranchiseForm from "./EditForm.js";

type FranchiseTableProps = {
  franchises: Franchise[];
  setFranchises: (franchises: Franchise[]) => void;
};

export const FranchiseTable = ({
  franchises,
  setFranchises,
}: FranchiseTableProps) => {
  const [editPopoverId, setEditPopoverId] = useState<number>();
  const [deletePopoverId, setDeletePopoverId] = useState<number>();
  const { franchiseService } = useFranchises();

  const handleEditFranchise = async () => {
    setFranchises(await franchiseService.getAll());
    setEditPopoverId(undefined);
  };

  const handleDeleteFranchise = async (franchiseId: number) => {
    await franchiseService.deleteOne(franchiseId);
    setFranchises(await franchiseService.getAll());
    setDeletePopoverId(undefined);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Sr No.</TableHead>
          <TableHead>FRANCHISE</TableHead>
          <TableHead>CITY</TableHead>
          <TableHead>ACTIONS</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {franchises.length > 0 ? (
          <>
            {franchises.map((franchise, key) => (
              <TableRow key={key}>
                <TableCell>{key + 1}</TableCell>
                <TableCell>{franchise.name}</TableCell>
                <TableCell>{franchise.city}</TableCell>
                <TableCell>
                  <Popover
                    // key={key}
                    open={editPopoverId === franchise.id}
                    onOpenChange={(open: boolean) => {
                      console.log("open", open);
                      setEditPopoverId(open ? franchise.id : undefined);
                    }}
                  >
                    <PopoverTrigger>
                      <Button>
                        <FontAwesomeIcon icon={faPenToSquare} />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <Card>
                        <EditFranchiseForm
                          currentFranchise={franchise}
                          handleEditFranchise={handleEditFranchise}
                        />
                      </Card>
                    </PopoverContent>
                  </Popover>
                  &nbsp;
                  <Popover
                    // key={key + "Delete"}
                    open={deletePopoverId === franchise.id}
                    onOpenChange={(open: boolean) => {
                      console.log("open", open);
                      setDeletePopoverId(open ? franchise.id : undefined);
                    }}
                  >
                    <PopoverTrigger>
                      <Button>
                        <FontAwesomeIcon icon={faTrash} />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <Card>
                        <p className="m-2">
                          Are you sure you want to delete{" "}
                          <strong>{franchise.name}?</strong>
                        </p>
                        <Button
                          className="ml-20 mb-2"
                          onClick={async () => {
                            await franchiseService.deleteOne(franchise.id);
                            handleDeleteFranchise(franchise.id);
                          }}
                        >
                          Confirm
                        </Button>
                      </Card>
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </TableRow>
            ))}
          </>
        ) : (
          <TableRow>
            <TableCell colSpan={4}>No Franchises added</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
