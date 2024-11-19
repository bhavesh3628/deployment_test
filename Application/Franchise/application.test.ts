import { AuctionService } from "../../Auction/Auction";
import { CreateAuctionDTO } from "../../Auction/Types";
import { EditionService } from "../../Edition/editionService";
import { CreateEditionDTO } from "../../Edition/Types";
import { FranchiseService } from "../../Franchise/Franchise";
import { CreateFranchiseDTO } from "../../Franchise/Types";
import { LeagueService } from "../../League/leagueService";
import { PlayerService } from "../../Players/playerService";
import { CreatePlayerDTO } from "../../Players/Types";
import { FranchiseApplication, FranchiseApplicationService } from "./application";
import { FranchiseApplicationMeta, CreateFranchiseApplicationDTO } from "./types";


describe("Application Service", () => {
  let applicationService: FranchiseApplicationService;
  let auctionService: AuctionService;
  let editionService: EditionService;
  let leagueService: LeagueService;
  let playerService: PlayerService;
  let franchiseService: FranchiseService


  beforeEach(() => {
    applicationService = new FranchiseApplicationService();
    auctionService = new AuctionService();
    editionService = new EditionService();
    leagueService = new LeagueService();
    playerService = new PlayerService();
    franchiseService = new FranchiseService();
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
    let franchiseDTO :CreateFranchiseDTO= {
name:"MI",
city:"Mumbai"
    }
    let franchise = franchiseService.addOne(franchiseDTO)

    

    expect(applications).toHaveLength(0);
    let application: CreateFranchiseApplicationDTO = {
      franchiseId: franchise.id,
      auctionId: auction.id,
      purse: 120,
      status:"pending"
    };

    let newApplication = applicationService.addOne(application);
    applications = applicationService.getAll();

    expect(applications).toHaveLength(1);
    let currentApplication = applications.find(
      (application) => application.id === newApplication.id
    );
    expect(currentApplication?.franchiseId).toBe(franchise.id);
  });

  it("should approve a application and push franchise to registered franchises for auction",()=>{
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
    let franchiseDTO :CreateFranchiseDTO= {
      name:"MI",
      city:"Mumbai"
          }
          let franchise = franchiseService.addOne(franchiseDTO)
      
    let application: CreateFranchiseApplicationDTO = {
      franchiseId: franchise.id,
      auctionId: auction.id,
      purse:120,
      status:"pending"
    };

    let newApplication = applicationService.addOne(application);
    applications = applicationService.getAll();

    expect(applications).toHaveLength(1);
    let currentApplication = applications.find(
      (application) => application.id === newApplication.id
    );
    expect(currentApplication?.franchiseId).toBe(franchise.id);
    let applicationMeta: FranchiseApplicationMeta = {
      authorizedOn: new Date().toDateString(),
      authorizedBy: auction.id ,// can be a league owner
      comment: "approved"
    }
    if(!currentApplication){
      throw new Error("application not found")
    }
    let processedApplication = applicationService.process(currentApplication,applicationMeta,"accepted",auctionService)
    expect(processedApplication?.status).toBe("accepted")
    let registeredFranchise = auction.registeredFranchises.find((franchise)=>franchise.franchiseId===processedApplication?.franchiseId)
    expect(registeredFranchise?.franchiseId).toBe(application.franchiseId)
  })
});
