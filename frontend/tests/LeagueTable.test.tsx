import { fireEvent, render, screen } from "@testing-library/react";
import { LeagueTable } from "../src/components/Pages/league/LeagueTable";
import "@testing-library/jest-dom";
import {
  DeleteOneLeagueService,
  EditOneLeagueService,
  GetAllLeagueService,
  AddOneLeagueService,
} from "@/components/Pages/league/league.service";
import { League } from "../src/components/Pages/league/league.service";
import { CreateLeagueDTO } from "../../League/Types";
import { AuctionProvider } from "@/components/Pages/AuctionProvider";
import { Edition } from "@/components/Pages/edition/edition.service";

export interface TestLeagueInterface
  extends GetAllLeagueService,
    AddOneLeagueService,
    DeleteOneLeagueService,
    EditOneLeagueService {}

export class SuccessLeagueService implements TestLeagueInterface {
  // should be initialized with existing leagues
  private leagues: League[] = [];
  getAll(): Promise<League[]> {
    return Promise.resolve(this.leagues);
  }

  addOne(createLeagueDTO: CreateLeagueDTO): Promise<League> {
    let newLeague = new League(createLeagueDTO);
    this.leagues = [...this.leagues, newLeague];
    return Promise.resolve(newLeague);
  }

  deleteOne(id: number): Promise<void> {
    this.leagues = this.leagues.filter((league) => league.id !== id);
    return Promise.resolve();
  }

  editOne(id: number, editedName: string): Promise<League> {
    let league = this.leagues.find((league) => league.id === id);
    if (!league) throw new Error("No league for editing");
    league.name = editedName;
    return Promise.resolve(league);
  }

  addEdition(edition: Edition): Promise<void> {
    return Promise.resolve();
  }

  xyz(updatedLeagues: League[]) {
    console.log(updatedLeagues);
  }
}

export const testService = new SuccessLeagueService();

describe("League Table component", () => {
  let leagueService: SuccessLeagueService;
  beforeEach(() => {
    leagueService = new SuccessLeagueService();
  });
  it("should render table component correctly", async () => {
    render(
      <AuctionProvider value={{ leagueService }}>
        <LeagueTable
          leagues={await leagueService.getAll()}
          setLeagues={leagueService.xyz}
        />
      </AuctionProvider>
    );
    const table = screen.getByRole("table");
    expect(table).toBeInTheDocument();
  });

  it("should render table intially with no leagues added text in first row ", async () => {
    render(
      <AuctionProvider value={{ leagueService }}>
        <LeagueTable
          leagues={await leagueService.getAll()}
          setLeagues={leagueService.xyz}
        />
      </AuctionProvider>
    );
    const table = screen.getByRole("table");
    expect(table).toBeInTheDocument();

    const cell = screen.getByText("No leagues added");
    expect(cell).toBeInTheDocument();
  });

  it("should render table with one row having data IPL", async () => {
    const newLeagueDTO: CreateLeagueDTO = {
      name: "IPL",
    };
    let leagues = await testService.getAll();
    const newLeague = await testService.addOne(newLeagueDTO);
    // const newLeagues: League[] = [newLeague];
    leagues = await testService.getAll();
    const setLeagues = (updatedLeagues: League[]) => {
      leagues = updatedLeagues;
    };
    render(
      <AuctionProvider value={{ leagueService }}>
        <LeagueTable
          leagues={await leagueService.getAll()}
          setLeagues={leagueService.xyz}
        />
      </AuctionProvider>
    );
    const table = screen.getByRole("table");
    expect(table).toBeInTheDocument();

    const cell = screen.getByText("IPL");
    expect(cell).toBeInTheDocument();
  });

  it("should delete row after clicking the delete button", async () => {
    let leagues: League[] = await testService.getAll();

    const setLeagues = (updatedLeagues: League[]) => {
      leagues = updatedLeagues;
    };

    render(
      <AuctionProvider value={{ leagueService }}>
        <LeagueTable
          leagues={await leagueService.getAll()}
          setLeagues={leagueService.xyz}
        />
      </AuctionProvider>
    );

    // const table = screen.getByRole("table");
    // expect(table).toBeInTheDocument();

    // const cell1 = screen.getByText("No leagues added");
    // expect(cell1).toBeInTheDocument();

    leagues = [
      ...leagues,
      { id: 1, name: "IPL", createdAt: "feb", editions: [] },
    ];
    const updatedLeagues = leagues;

    setLeagues(updatedLeagues);

    render(
      <AuctionProvider value={{ leagueService }}>
        <LeagueTable
          leagues={await leagueService.getAll()}
          setLeagues={leagueService.xyz}
        />
      </AuctionProvider>
    );
    const cell = await screen.getByText("IPL");
    expect(cell).toBeInTheDocument();

    const deleteButton = screen.getByTestId("trash");
    expect(deleteButton).toBeInTheDocument();
    await deleteButton.click();

    const popoverD = await screen.getByRole("dialog");
    expect(popoverD).toBeInTheDocument();

    const confirmButton = await screen.findByTestId("confirm-button");
    expect(confirmButton).toBeInTheDocument();
    await confirmButton.click();

    // await testService.deleteOne(1);
    // expect(await testService.getAll()).toHaveLength(0);
  });

  it("it should be able edit league", async () => {
    let leagues: League[] = await testService.getAll();

    const setLeagues = (updatedLeagues: League[]) => {
      leagues = updatedLeagues;
    };

    render(
      <AuctionProvider value={{ leagueService }}>
        <LeagueTable
          leagues={await leagueService.getAll()}
          setLeagues={leagueService.xyz}
        />
      </AuctionProvider>
    );
    let iplDTO = { name: "IPL" };
    let ipl = await testService.addOne(iplDTO);
    leagues = [...leagues, ipl];

    const updatedLeagues = leagues;

    setLeagues(updatedLeagues);

    render(
      <AuctionProvider value={{ leagueService }}>
        <LeagueTable
          leagues={await leagueService.getAll()}
          setLeagues={leagueService.xyz}
        />
      </AuctionProvider>
    );

    const cell = screen.getByText("IPL");
    expect(cell).toBeInTheDocument();

    const editButton = screen.getByTestId("edit");
    expect(editButton).toBeInTheDocument();

    await editButton.click();

    const editInputField = await screen.getByRole("textbox", {
      name: "League",
    });
    fireEvent.change(editInputField, { target: { value: "IPL2024" } });
    const confirmEditButton = await screen.getByRole("button", {
      name: /Edit/,
    });

    await fireEvent.click(confirmEditButton);
    await testService.editOne(ipl.id, "IPL2024");

    let league = (await testService.getAll()).find(
      (league) => league.id === ipl.id
    );
    render(
      <AuctionProvider value={{ leagueService }}>
        <LeagueTable
          leagues={await leagueService.getAll()}
          setLeagues={leagueService.xyz}
        />
      </AuctionProvider>
    );
    await screen.getByText("IPL2024");

    await expect(league?.name).toBe("IPL2024");
    // await expect(updatedCell).toBeInTheDocument();
  });
});
