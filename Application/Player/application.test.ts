import { AuctionService } from "../../Auction/Auction";
import { CreateAuctionDTO } from "../../Auction/Types";
import { EditionService } from "../../Edition/editionService";
import { CreateEditionDTO } from "../../Edition/Types";
import { LeagueService } from "../../League/leagueService";
import { PlayerService } from "../../Players/playerService";
import { CreatePlayerDTO } from "../../Players/Types";
import { PlayerApplication, PlayerApplicationService } from "./application";
import { PlayerApplicationMeta, CreatePlayerApplicationDTO } from "./types";


describe("Application Service", () => {
  let applicationService: PlayerApplicationService;
  let auctionService: AuctionService;
  let editionService: EditionService;
  let leagueService: LeagueService;
  let playerService: PlayerService;


  beforeEach(() => {
    applicationService = new PlayerApplicationService();
    auctionService = new AuctionService();
    editionService = new EditionService();
    leagueService = new LeagueService();
    playerService = new PlayerService();
  });

  it("should start with no application", () => {
    let applications = applicationService.getAll();
    expect(applications).toHaveLength(0);
  });

  it("should add one application", () => {
    let thala: CreatePlayerDTO = {
      dob: 2002,
      name: "Mahi",
      nationality: "indian",
      skills: {
        batter: 0,
        bowler: 0,
        allRounder: 0,
        wicketKeeper: 1,
      },
    };
    let newPlayer = playerService.addOne(thala)
    let applications = applicationService.getAll();
    let iplDTO = {
      name: "IPL",
    };
    let league = leagueService.addOne(iplDTO);
    let editionDTO: CreateEditionDTO = {
      name: "TATA",
      leagueId: league.id,
    };
    let edition = editionService.addOne(editionDTO);
    let auctionDTO: CreateAuctionDTO = {
      editionId: edition.id,
      purse: 1000,
      numberOfRounds: 3,
      coolDownPeriod: 300, // in seconds
      plannedStartDate: new Date().toDateString(),
    };
    let auction = auctionService.addOne(auctionDTO);

    expect(applications).toHaveLength(0);
    let application: CreatePlayerApplicationDTO = {
      playerId: newPlayer.id,
      auctionId: auction.id,
      roundBasePrice: { 1: 100, 2: 40, 3: 10 },
    };

    let newApplication = applicationService.addOne(application);
    applications = applicationService.getAll();

    expect(applications).toHaveLength(1);
    let currentApplication = applications.find(
      (application) => application.id === newApplication.id
    );
    expect(currentApplication?.playerId).toBe(1);
  });

  it("should approve a application and push player to pool of player for auction",()=>{
    let thala: CreatePlayerDTO = {
      dob: 2002,
      name: "Mahi",
      nationality: "indian",
      skills: {
        batter: 0,
        bowler: 0,
        allRounder: 0,
        wicketKeeper: 1,
      },
    };
    let newPlayer = playerService.addOne(thala)
  
    let iplDTO = {
      name: "IPL",
    };
    let league = leagueService.addOne(iplDTO);

    let editionDTO: CreateEditionDTO = {
      name: "TATA",
      leagueId: league.id,
    };
    let edition = editionService.addOne(editionDTO);

    let auctionDTO: CreateAuctionDTO = {
      editionId: edition.id,
      purse: 1000,
      numberOfRounds: 3,
      coolDownPeriod: 300, // in seconds
      plannedStartDate: new Date().toDateString(),
    };
    let auction = auctionService.addOne(auctionDTO);
    
    let applications = applicationService.getAll();
    expect(applications).toHaveLength(0);
    let application: CreatePlayerApplicationDTO = {
      playerId: newPlayer.id,
      auctionId: auction.id,
      roundBasePrice: { 1: 100, 2: 40, 3: 10 },
    };

    let newApplication = applicationService.addOne(application);
    applications = applicationService.getAll();

    expect(applications).toHaveLength(1);
    let currentApplication = applications.find(
      (application) => application.id === newApplication.id
    );
    expect(currentApplication?.playerId).toBe(newPlayer.id);
    let applicationMeta: PlayerApplicationMeta = {
      authorizedOn: new Date().toDateString(),
      authorizedBy: auction.id ,// can be a league owner
      comment: "approved"
    }
    if(!currentApplication){
      throw new Error("application not found")
    }
    let processedApplication = applicationService.process(currentApplication,applicationMeta,"accepted",auctionService)
    expect(processedApplication?.status).toBe("accepted")
    let poolPlayer = auction.poolPlayers.find((player)=>player.playerId===processedApplication?.playerId)
    expect(poolPlayer?.playerId).toBe(application.playerId)
  })
});
