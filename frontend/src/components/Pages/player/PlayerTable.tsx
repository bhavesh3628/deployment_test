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
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { useState } from "react";
import { usePlayers } from "../AuctionProvider.js";
import { Player } from "./player.service.js";
import EditPlayerForm from "./EditForm.js";
import { Link } from "react-router-dom";

type PlayerTableProps = {
  players: Player[];
  setPlayers: (players: Player[]) => void;
};

export const PlayerTable = ({ players, setPlayers }: PlayerTableProps) => {
  const [editPopoverId, setEditPopoverId] = useState<string>();
  const [deletePopover, setDeletePopover] = useState<string>();
  const { playerService } = usePlayers();

  const handleEditPlayer = async () => {
    setPlayers(await playerService.getAll());
    setEditPopoverId(undefined);
  };

  const handleDeletePlayer = async (playerId: string) => {
    await playerService.deleteOne(playerId);
    setPlayers(await playerService.getAll());
    setDeletePopover(undefined);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Sr No.</TableHead>
          <TableHead>NAME</TableHead>
          <TableHead>DATE OF BIRTH</TableHead>
          <TableHead>NATIONALITY</TableHead>
          <TableHead>SPECIALIZATION</TableHead>
          {/* <TableHead>CREATED AT</TableHead> */}
          <TableHead>ACTIONS</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {players.length > 0 ? (
          <>
            {players.map((player, key) => (
              <TableRow>
                <TableCell>{key + 1}</TableCell>
                <TableCell>{player.name}</TableCell>
                <TableCell>{player.dob}</TableCell>
                <TableCell>{player.nationality}</TableCell>
                <TableCell>{player.specialization}</TableCell>
                {/* <TableCell>{player.createdAt}</TableCell> */}
                {/* <Popover
                // key={key}
                // open={editPopoverId === player.id}
                // onOpenChange={(open: boolean) => {
                //   console.log("open", open);
                //   setEditPopoverId(open ? player.id : undefined);
                // }}
                > */}
                <AlertDialog
                  key={key}
                  open={editPopoverId === player.id}
                  onOpenChange={(open: boolean) => {
                    console.log("open", open);
                    setEditPopoverId(open ? player.id : undefined);
                  }}
                >
                  <AlertDialogTrigger>
                    <Button key={player.id} data-testid="edit">
                      <FontAwesomeIcon icon={faPenToSquare} />
                    </Button>
                  </AlertDialogTrigger>
                  {/* <AlertDialogTrigger>
                        <Button key={player.id} data-testid="edit">
                          <FontAwesomeIcon icon={faPenToSquare} />
                        </Button>
                      </AlertDialogTrigger> */}
                  <AlertDialogContent>
                    <EditPlayerForm
                      currentPlayer={player}
                      handleEditPlayer={handleEditPlayer}
                    />
                    {/* <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your account and remove your data from our
                        servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction></AlertDialogAction>
                    </AlertDialogFooter> */}
                  </AlertDialogContent>

                  {/* <EditPlayerForm
                            currentPlayer={player}
                            handleEditPlayer={handleEditPlayer}
                            /> */}
                </AlertDialog>
                &nbsp;
                <AlertDialog
                  data-testid="popover"
                  key={key}
                  open={deletePopover === player.id}
                  onOpenChange={(open: boolean) => {
                    setDeletePopover(open ? player.id : undefined);
                  }}
                >
                  <AlertDialogTrigger>
                    <Button data-testid="trash">
                      <FontAwesomeIcon icon={faTrash} />
                    </Button>
                  </AlertDialogTrigger>

                  <AlertDialogContent>
                    <p className="m-2">
                      Are you sure you want to delete{" "}
                      <strong>{player.name}?</strong>
                    </p>
                    <Button
                      data-testid="confirm-button"
                      onClick={async () => {
                        await handleDeletePlayer(player.id);
                      }}
                    >
                      Confirm
                    </Button>
                  </AlertDialogContent>
                </AlertDialog>
                <Link to={`/playerApplications/${player.id}`}>
                  <Button>Register</Button>
                </Link>
              </TableRow>
            ))}
          </>
        ) : (
          <TableRow>
            <TableCell colSpan={4}>No players added</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
