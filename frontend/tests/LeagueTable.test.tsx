import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { LeagueTable } from "../src/components/Pages/league/LeagueTable";
import '@testing-library/jest-dom';
import leagueService, { DeleteOneLeagueService, GetAllLeagueService } from "@/components/Pages/league/league.service";
import { League } from "../src/components/Pages/league/league.service";
import { CreateLeagueDTO } from "../../League/Types";


describe("Register component", () => {


  // it("should render table component correctly", () => {
  //   const leagues:League[] = []
  //   const setLeagues: (leagues: League[]) => void=(leagues)=>{};
  //   render(<LeagueTable leagues={leagues} setLeagues={setLeagues} />);
  //   const table = screen.getByRole("table");
  //   expect(table).toBeInTheDocument();
  // });
  
  // it("should render table intially with no leagues added text in first row ", () => {
  //   const leagues:League[] = []
  //   const setLeagues: (leagues: League[]) => void=(leagues)=>{};
  //   render(<LeagueTable leagues={leagues} setLeagues={setLeagues} />);
  //   const table = screen.getByRole("table");
  //   expect(table).toBeInTheDocument();    
  //   const cell = screen.getByText("No leagues added")
  //   expect(cell).toBeInTheDocument();
  // });

  // it("should render table with one row having data IPL",async () => {
  //   const newLeague = await leagueService.addOne({name:"ipl"})
  //   const leagues:League[] = [newLeague]
  //   const setLeagues: (leagues: League[]) => void=(leagues)=>{};
  //   render(<LeagueTable leagues={leagues} setLeagues={setLeagues} />);
  //   const table = screen.getByRole("table");
  //   expect(table).toBeInTheDocument();    
  //   const cell = screen.getByText("ipl")
  //   expect(cell).toBeInTheDocument();
  // });

  class SuccessLeagueService implements GetAllLeagueService, DeleteOneLeagueService {
    private leagues: League[] = []

    getAll(): Promise<League[]> {
        return Promise.resolve(this.leagues)
    }

    deleteOne(id: number): Promise<void> {
        return Promise.resolve()
    }
  }

  it("should delete row after clicking the delete button", async () => {

    const newLeague = await leagueService.addOne({name:"ipl"})

    let leagues1:League[] = [newLeague]
  

    const setLeagues: (leagues: League[]) => void=(leagues)=>{
      leagues1 = [...leagues]
    };
    setLeagues(leagues1)
    render(<LeagueTable leagues={leagues1} setLeagues={setLeagues} leagueService={new SuccessLeagueService()} />);
    const table = screen.getByRole("table");
    expect(table).toBeInTheDocument();    
    const cell = screen.getByText("ipl")
    expect(cell).toBeInTheDocument();
    const deleteButton = screen.getByTestId("trash")
    expect(deleteButton).toBeInTheDocument()
    await deleteButton.click()
    const popoverD = await screen.getByRole("dialog")
    expect(popoverD).toBeInTheDocument()
    const confirmButton =  await screen.findByTestId('confirm-button')
 
    expect(confirmButton).toBeInTheDocument()
    await confirmButton.click()
    
    const updatedCell = await screen.findByText("No leagues added");
    expect(updatedCell).toBeInTheDocument()
  });

});