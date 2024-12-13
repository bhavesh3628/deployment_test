import { Edition } from "./edition.service";
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
import { Button } from "../../ui/button.js";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover.js";
import { Card } from "@/components/ui/card.js";
import { useState } from "react";
import EditLeagueForm from "./EditForm.js";
import { EditionWithLeagues } from "./Edition.js";
import { useEditions } from "../AuctionProvider.js";

type EditionTableProps = {
  editionWithLeagues: EditionWithLeagues[];
  setEdition: (editions: Edition[]) => void;
};

export const EditionTable = ({
  editionWithLeagues,
  setEdition: setEditions,
}: EditionTableProps) => {
  const [editPopoverId, setEditPopoverId] = useState<number>();
  const [deletePopoverId, setDeletePopoverId] = useState<number>();
  const { editionService } = useEditions();

  const handleEditEdition = async () => {
    setEditions(await editionService.getAll());
    setEditPopoverId(undefined);
  };

  const handleDeleteEdition = async (editionId: number) => {
    await editionService.deleteOne(editionId);
    setEditions(await editionService.getAll());
    setDeletePopoverId(undefined);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Sr No.</TableHead>
          <TableHead>LEAGUE</TableHead>
          <TableHead>NAME</TableHead>
          <TableHead>ACTIONS</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {editionWithLeagues.length > 0 ? (
          <>
            {editionWithLeagues.map((edition, key) => (
              <TableRow key={key}>
                <TableCell>{key + 1}</TableCell>
                <TableCell>{edition.league?.name}</TableCell>
                <TableCell>{edition.name}</TableCell>
                <TableCell>
                  <Popover
                    // key={key}
                    open={editPopoverId === edition.id}
                    onOpenChange={(open: boolean) => {
                      console.log("open", open);
                      setEditPopoverId(open ? edition.id : undefined);
                    }}
                  >
                    <PopoverTrigger>
                      <Button>
                        <FontAwesomeIcon icon={faPenToSquare} />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <Card>
                        <EditLeagueForm
                          currentEdition={edition}
                          handleEditEdition={handleEditEdition}
                        />
                      </Card>
                    </PopoverContent>
                  </Popover>
                  &nbsp;
                  <Popover
                    // key={key + "Delete"}
                    open={deletePopoverId === edition.id}
                    onOpenChange={(open: boolean) => {
                      console.log("open", open);
                      setDeletePopoverId(open ? edition.id : undefined);
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
                          <strong>{edition.name}?</strong>
                        </p>
                        <Button
                          className="ml-20 mb-2"
                          onClick={async () => {
                            await handleDeleteEdition(edition.id);
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
            <TableCell colSpan={4}>No editions added</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
