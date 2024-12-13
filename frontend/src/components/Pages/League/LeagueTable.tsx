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
import EditLeagueForm from "./EditForm";
import { useLeagues } from "../AuctionProvider.js";
import { League } from "./league.service.js";

type LeagueTableProps = {
  leagues: League[];
  setLeagues: (leagues: League[]) => void;
};

export const LeagueTable = ({ leagues, setLeagues }: LeagueTableProps) => {
  const [editPopoverId, setEditPopoverId] = useState<number>();
  const [deletePopover, setDeletePopover] = useState<number>();
  const { leagueService } = useLeagues();
  const handleEditLeague = async () => {
    setLeagues(await leagueService.getAll());
    setEditPopoverId(undefined);
  };

  const handleDeleteLeague = async () => {
    setLeagues(await leagueService.getAll());
    setDeletePopover(undefined);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Sr No.</TableHead>
          <TableHead>NAME</TableHead>
          {/* <TableHead>EDITIONS</TableHead> */}
          <TableHead>CREATED AT</TableHead>
          <TableHead>ACTIONS</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {leagues.length > 0 ? (
          <>
            {leagues!.map((league, key) => (
              <TableRow>
                <TableCell>{key + 1}</TableCell>
                <TableCell>{league.name}</TableCell>
                {/* <TableCell>{league.editions.length}</TableCell> */}
                <TableCell>{league.createdAt}</TableCell>

                <TableCell>
                  <Popover
                    key={key} // league.id crashes edit and delete ui
                    open={editPopoverId === league.id}
                    onOpenChange={(open: boolean) => {
                      console.log("open", open);
                      setEditPopoverId(open ? league.id : undefined);
                    }}
                  >
                    <PopoverTrigger>
                      <Button key={league.id} data-testid="edit">
                        <FontAwesomeIcon icon={faPenToSquare} />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <Card>
                        <EditLeagueForm
                          currentLeague={league}
                          handleEditLeague={handleEditLeague}
                          leagueService={leagueService!}
                        />
                      </Card>
                    </PopoverContent>
                  </Popover>
                  &nbsp;
                  <Popover
                    data-testid="popover"
                    key={key}
                    open={deletePopover === league.id}
                    onOpenChange={(open: boolean) => {
                      setDeletePopover(open ? league.id : undefined);
                    }}
                  >
                    <PopoverTrigger>
                      <Button data-testid="trash">
                        <FontAwesomeIcon icon={faTrash} />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <Card>
                        <p className="m-2">
                          Are you sure you want to delete{" "}
                          <strong>{league.name}?</strong>
                        </p>
                        <Button
                          data-testid="confirm-button"
                          className="ml-20 mb-2"
                          onClick={async () => {
                            await leagueService.deleteOne(league.id);
                            handleDeleteLeague();
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
            <TableCell colSpan={4}>No leagues added</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
