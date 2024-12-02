import leagueService, { League } from "./league.service";
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

type LeagueTableProps = {
  leagues: League[];
  setLeagues: (leagues: League[]) => void;
};

export const LeagueTable = ({ leagues, setLeagues }: LeagueTableProps) => {
  const [editPopoverId, setEditPopoverId] = useState<number>();
  const handleEditLeague = async (id: number, editedName: string) => {
    // const editedLeague = leagues.find((league) => league.id === id);
    // if (editedLeague) {
    //   editedLeague.name = editedName;
    //   const updatedLeagues = leagues.filter((league) => league.id !== id);

    // }
    //setLeagues([editedLeague, ...updatedLeagues]); //service.getAll
    setLeagues(await leagueService.getAll());
    setEditPopoverId(undefined);
    // setLeagues(leagues);
    // console.log(editedLeague);
  };

  const handleDeleteLeague = async (leagueId: number) => {
    await leagueService.deleteOne(leagueId);
    setLeagues(await leagueService.getAll());
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Sr No.</TableHead>
          <TableHead>NAME</TableHead>
          <TableHead>CREATED AT</TableHead>
          <TableHead>ACTIONS</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {leagues.length > 0 ? (
          <>
            {leagues.map((league, key) => (
              <TableRow>
                <TableCell>{key + 1}</TableCell>
                <TableCell>{league.name}</TableCell>
                <TableCell>{league.createdAt}</TableCell>
                <TableCell>
                  <Popover
                    key={league.id}
                    open={editPopoverId === league.id}
                    onOpenChange={(open: boolean) => {
                      console.log("open", open);
                      setEditPopoverId(open ? league.id : undefined);
                    }}
                  >
                    <PopoverTrigger>
                      <Button key={league.id}>
                        <FontAwesomeIcon icon={faPenToSquare} />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <Card>
                        <EditLeagueForm
                          currentLeague={league}
                          handleEditLeague={handleEditLeague}
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
                          <strong>{league.name}?</strong>
                        </p>
                        <Button
                          className="ml-20 mb-2"
                          onClick={() => {
                            handleDeleteLeague(league.id);
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
