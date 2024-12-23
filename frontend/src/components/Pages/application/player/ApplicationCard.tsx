import { useEffect, useState } from "react";
import { PlayerApplication } from "./application.service";
import { Player } from "../../player/player.service";
import { usePlayers } from "../../AuctionProvider";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import ViewApplicationComponent from "./ViewApplication";

type ApplicationCardProps = {
  playerApplication: PlayerApplication;
};

const ApplicationCard = ({ playerApplication }: ApplicationCardProps) => {
  let [player, setPlayer] = useState<Player>();
  const { playerService } = usePlayers();

  useEffect(() => {
    const fetchCurrentPlayer = async () => {
      try {
        const currentPlayer = await playerService.findOne(
          playerApplication.playerId
        );
        setPlayer(currentPlayer);
      } catch (error) {
        if (error) console.log("error while fetching player in card: ", error);
      }
    };
    fetchCurrentPlayer();
    console.log("currentPlayer is: ", player);
  }, []);

  return (
    <Card className="w-1/4">
      <CardHeader>
        <CardTitle className="text-3xl">{player?.name}</CardTitle>
        <CardDescription>
          <p>Auction Id: {playerApplication.auctionId}</p>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Nationality - {player?.nationality}</p>
        <p>Date of birth - {player?.dob}</p>
        <p>
          {player?.specialization}
          <FontAwesomeIcon className="ml-2 text-yellow-400" icon={faStar} />
        </p>
        <p>Round Base Prices: {playerApplication.roundBasePrice.toString()}</p>
      </CardContent>
      <CardFooter>
        <div className="flex flex-row gap-3">
          {playerApplication.status === "accepted" ? (
            <p className="pl-2 pr-2 pt-1 pb-1 text-center text-green-500 bg-green-200 border-green-500 rounded-lg">
              {playerApplication.status.toLocaleUpperCase()}
            </p>
          ) : playerApplication.status === "pending" ? (
            <p className="pl-2 pr-2 pt-1 pb-1 text-center text-sm text-gray-400 bg-gray-100 border-2 border-gray-400 rounded-lg">
              {playerApplication.status.toLocaleUpperCase()}
            </p>
          ) : (
            <p className="pl-2 pr-2 pt-1 pb-1 text-center text-sm text-red-500 bg-red-200 border-2 border-red-500 rounded-lg">
              {playerApplication.status.toLocaleUpperCase()}
            </p>
          )}

          <AlertDialog>
            <AlertDialogTrigger>
              <Button
                className="rounded-lg border-2 border-slate-800 bg-slate-200"
                variant={"outline"}
              >
                {/* <FontAwesomeIcon icon={faTrash} /> */}
                View Application
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              {/* <ViewApplicationComponent
                player={player}
                playerApplication={playerApplication}
              /> */}
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ApplicationCard;
