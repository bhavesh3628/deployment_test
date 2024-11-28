import { LeagueCard } from "./addCard.js";
import { League } from "./league.js";
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

type handleLeagueProps = {
  leagues: League[];
};

export const LeagueTable = ({ leagues }: handleLeagueProps) => {
  return (
    <Table className="">
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>NAME</TableHead>
          <TableHead>CREATED AT</TableHead>
          <TableHead>ACTIONS</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {leagues.length > 0 ? (
          <>
            {leagues.map((league) => (
              <TableRow>
                <TableCell>{league.id}</TableCell>
                <TableCell>{league.name}</TableCell>
                <TableCell>{league.createdAt}</TableCell>
                <TableCell>
                  <Button>
                    <FontAwesomeIcon icon={faPenToSquare} />
                  </Button>
                  &nbsp;
                  <Button>
                    <FontAwesomeIcon icon={faTrash} />
                  </Button>
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

export const LeagueListCards = ({ leagues }: handleLeagueProps) => {
  return (
    <>
      {leagues.map((league) => (
        <LeagueCard key={league.name} league={league} />
      ))}
    </>
  );
};
