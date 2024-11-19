import { AuctionService } from "../Auction/Auction";
import { CreateAuctionDTO } from "../Auction/Types";
import { League, LeagueService } from "../League/leagueService";
import { CreateLeagueDTO } from "../League/Types";
import { EditionService } from "./editionService";
import { CreateEditionDTO } from "./Types";

describe("edition", () => {
  let editionService: EditionService;
  let leagueService: LeagueService;
  let iplDTO: CreateLeagueDTO;
  let auctionService: AuctionService;
  beforeEach(() => {
    editionService = new EditionService();
    leagueService = new LeagueService();
    auctionService = new AuctionService();
    iplDTO = {
      name: "IPL",
    };
  });

  it("Each edition should have league reference", () => {
    //when
    let league = leagueService.addOne(iplDTO);
    let editionDTO: CreateEditionDTO = {
      name: "TATA",
      leagueId: league.id,
    };

    let newEdition = editionService.addOne(editionDTO);
    let editions = editionService.getAll()
    let serachedEdition = editions.find(edition=> edition.id === newEdition.id)
    // let searchedEditionLeague = leagueService.getAll().find(legue=>league.id===serachedEdition?.leagueId)
    //then
    expect(serachedEdition?.id).toBe(newEdition.id);
  });

  it("each edition should have reference of auction", () => {
    let league = leagueService.addOne(iplDTO);
    let editionDTO: CreateEditionDTO = {
      name: "TATA",
      leagueId: league.id,
    };

    const edition = editionService.addOne(editionDTO);
    let date: Date = new Date();
    let auctionDTO: CreateAuctionDTO = {
      editionId: edition.id,
      purse: 1000,
      numberOfRounds: 3,
      coolDownPeriod: 300, // in seconds
      plannedStartDate: date.toDateString(),
    };
    let auction = auctionService.addOne(auctionDTO);
    editionService.setAuctionId(edition.id, auction.id);
  });
});
