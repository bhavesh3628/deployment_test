import editionService, { Edition } from "./edition.service";
import {
  Table,
  TableBody,
  TableCaption,
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
import { useEffect, useState } from "react";
import EditLeagueForm from "./EditForm.js";
import { leagueService } from "../league/league.service.js";

type EditionTableProps = {
  editions: Edition[];
  setEditions: (editions: Edition[]) => void;
};

export const EditionTable = ({ editions, setEditions }: EditionTableProps) => {
  const [editPopoverId, setEditPopoverId] = useState<number>();

  const handleEditEdition = (id: number, editedName: string) => {
    setEditions(editionService.getAll());
    setEditPopoverId(undefined);
  };
  const handleDeleteEdition = (editionId: number) => {
    editionService.deleteOne(editionId);
    setEditions(editionService.getAll());
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
        {editions.length > 0 ? (
          <>
            {editions.map((edition, key) => (
              <TableRow>
                <TableCell>{key + 1}</TableCell>
                <TableCell>
                  {leagueService.findLeague(edition.leagueId).name}
                </TableCell>
                <TableCell>{edition.name}</TableCell>
                <TableCell>
                  <Popover
                    key={edition.id}
                    open={editPopoverId === edition.id}
                    onOpenChange={(open: boolean) => {
                      console.log("open", open);
                      setEditPopoverId(open ? edition.id : undefined);
                    }}
                  >
                    <PopoverTrigger>
                      <Button key={edition.id}>
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
                  <Popover>
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
                          onClick={() => {
                            handleDeleteEdition(edition.id);
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
