import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover";

import AddPlayerForm from "./AddForm.js";
import { useEffect, useState } from "react";
import { PlayerTable } from "./PlayerTable.js";
import { Button } from "../../ui/button.jsx";
import { usePlayers } from "../AuctionProvider.js";
import { Player } from "./player.service.js"

function PlayerComponent(){
    const [players, setPlayers] = useState<Player[]>([]);
    const { playerService } = usePlayers()
    const [isPopoverOpen, setPopover] = useState(false)

    useEffect(() => {
        const fetchPlayers = async () => {
            try {
                const fetchedPlayers = await playerService.getAll();
                setPlayers(fetchedPlayers);
            } catch (error) {
                console.error("Failed to fetch players:", error);
            }
        }
        fetchPlayers();
    }, [])

    const handleAddPlayer = async () => {
        setPlayers(await playerService.getAll());
        setPopover(false);
    }

    return(
        <div className="w-full m-4">
            <div className="flex flex-row justify-between">
                <h1 className="flex justify-start text-xl font-bold">
                    Player Management
                </h1>
                <div className="flex justify-center">
                    <Popover open={isPopoverOpen} onOpenChange={setPopover}>
                        <PopoverTrigger>
                            <Button>Add Player</Button>
                        </PopoverTrigger>
                        <PopoverContent className="mr-4">
                            <AddPlayerForm handleAddPlayer={handleAddPlayer}></AddPlayerForm>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
            <div className="block">
                <PlayerTable players={players} setPlayers={setPlayers} />
            </div>
        </div>
    )
}

export default PlayerComponent