import { FranchiseApplication, FranchiseApplicationService } from "../Application/Franchise/application";
import { CreateFranchiseApplicationDTO, FranchiseApplicationMeta } from "../Application/Franchise/types";
import { PlayerApplicationService } from "../Application/Player/application";
import {
  CreatePlayerApplicationDTO,
  PlayerApplicationMeta,
  EditPlayerApplicationDTO,
} from "../Application/Player/types";
import { EditionService } from "../Edition/editionService";
import { CreateEditionDTO } from "../Edition/Types";
import { FranchiseService } from "../Franchise/Franchise";
import { CreateFranchiseDTO } from "../Franchise/Types";
import { League, LeagueService } from "../League/leagueService";
import { CreateLeagueDTO } from "../League/Types";
import { PlayerService } from "../Players/playerService";
import { CreatePlayerDTO } from "../Players/Types";
import { AuctionService } from "./Auction";
import { RegisteredFranchise } from "./RegisteredFranchise/RegisteredFranchise";
import { CreateRegisteredFranchiseDTO } from "./RegisteredFranchise/types";
import { BiddingSession } from "./Round/BiddingSession/biddingSession";
import { CreateBidDTO } from "./Round/BiddingSession/types";
import { CreateAuctionDTO } from "./Types";

describe("Auction Service", () => {
  let auctionService: AuctionService;
  let playerService: PlayerService;
  let leagueService: LeagueService;
  let applicationService: PlayerApplicationService;
  let franchiseApplicationService: FranchiseApplicationService;
  let editionService: EditionService;
  let franchiseService: FranchiseService;
  beforeEach(() => {
    auctionService = new AuctionService();
    playerService = new PlayerService();
    franchiseService = new FranchiseService();
    leagueService = new LeagueService();
    applicationService = new PlayerApplicationService();
    franchiseApplicationService = new FranchiseApplicationService();
    editionService = new EditionService();
  });
  

  it("start with no auction", () => {
    //when
    let auctions = auctionService.getAll();
    expect(auctions).toHaveLength(0);
  });
  it("should be able to add/create one auction", () => {
    //when
    let auctions = auctionService.getAll();
    expect(auctions).toHaveLength(0);
    let date: Date = new Date();
    let auctionDTO: CreateAuctionDTO = {
      editionId: 1,
      purse: 1000,
      numberOfRounds: 3,
      coolDownPeriod: 300, // in seconds
      plannedStartDate: date.toDateString(),
    };

    let newAuction = auctionService.addOne(auctionDTO);
    auctions = auctionService.getAll();

    expect(auctions).toHaveLength(1);
    let currentAuction = auctions.find(
      (auction) => auction.id === newAuction.id
    );
    expect(currentAuction?.editionId).toBe(1);
  });



  it("should be able to start the auction", () => {
    let franchises = franchiseService.getAll();
    expect(franchises).toHaveLength(0);
    let franchise: CreateFranchiseDTO = {
      name: "MI",
      city: "Mumbai",
    };
    let newFranchise = franchiseService.addOne(franchise);
    franchises = franchiseService.getAll();
    expect(franchises).toHaveLength(1);
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
    let newPlayer = playerService.addOne(thala);

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
    let applicationMeta: PlayerApplicationMeta= {
      authorizedOn: new Date().toDateString(),
      authorizedBy: auction.id, // can be a league owner
      comment: "approved",
    };
    if (!currentApplication) {
      throw new Error("application not found");
    }
    let processedApplication = applicationService.process(
      currentApplication,
      applicationMeta,
      "accepted",
      auctionService
    );
    expect(processedApplication?.status).toBe("accepted");
    let poolPlayer = auction.poolPlayers.find(
      (player) => player.playerId === processedApplication?.playerId
    );
    console.log(auction.poolPlayers)
    expect(poolPlayer?.playerId).toBe(application.playerId);
    let toRegisterFranchise:CreateFranchiseApplicationDTO = {
      franchiseId: newFranchise.id,
      auctionId: auction.id,
      purse: 100,
      status:"pending"
    };
    let registeredFranchise = franchiseApplicationService.addOne(toRegisterFranchise)
    let franchiseApplicationMeta: FranchiseApplicationMeta= {
        authorizedOn: new Date().toDateString(),
        authorizedBy: auction.id, // can be a league owner
        comment: "approved",
      };
    auctionService.processFranchiseApplication(registeredFranchise,franchiseApplicationMeta,"accepted")
    console.log(auction.registeredFranchises)
    expect(registeredFranchise?.purse).toBe(toRegisterFranchise.purse);
    if (registeredFranchise) {
    let newBiddingSession = auctionService.start(auction.id);
        
    expect(newBiddingSession!.status).toBe("started")
  }

  });
//   it("should be able to take bids", () => {
//     let franchises = franchiseService.getAll();
//     expect(franchises).toHaveLength(0);
//     let franchise: CreateFranchiseDTO = {
//       name: "MI",
//       city: "Mumbai",
//     };
//     let newFranchise = franchiseService.addOne(franchise);
//     franchises = franchiseService.getAll();
//     expect(franchises).toHaveLength(1);
//     let thala: CreatePlayerDTO = {
//       dob: 2002,
//       name: "Mahi",
//       nationality: "indian",
//       skills: {
//         batter: 0,
//         bowler: 0,
//         allRounder: 0,
//         wicketKeeper: 1,
//       },
//     };
//     let newPlayer = playerService.addOne(thala);

//     let iplDTO = {
//       name: "IPL",
//     };
//     let league = leagueService.addOne(iplDTO);

//     let editionDTO: CreateEditionDTO = {
//       name: "TATA",
//       leagueId: league.id,
//     };
//     let edition = editionService.addOne(editionDTO);

//     let auctionDTO: CreateAuctionDTO = {
//       editionId: edition.id,
//       purse: 1000,
//       numberOfRounds: 3,
//       coolDownPeriod: 300, // in seconds
//       plannedStartDate: new Date().toDateString(),
//     };
//     let auction = auctionService.addOne(auctionDTO);

//     let applications = applicationService.getAll();
//     expect(applications).toHaveLength(0);
//     let application: CreatePlayerApplicationDTO = {
//       playerId: newPlayer.id,
//       auctionId: auction.id,
//       roundBasePrice: { 1: 100, 2: 40, 3: 10 },
//     };

//     let newApplication = applicationService.addOne(application);
//     applications = applicationService.getAll();

//     expect(applications).toHaveLength(1);
//     let currentApplication = applications.find(
//       (application) => application.id === newApplication.id
//     );
//     expect(currentApplication?.playerId).toBe(newPlayer.id);
//     let applicationMeta: PlayerApplicationMeta= {
//       authorizedOn: new Date().toDateString(),
//       authorizedBy: auction.id, // can be a league owner
//       comment: "approved",
//     };
//     if (!currentApplication) {
//       throw new Error("application not found");
//     }
//     let processedApplication = applicationService.process(
//       currentApplication,
//       applicationMeta,
//       "accepted",
//       auctionService
//     );
//     expect(processedApplication?.status).toBe("accepted");
//     let poolPlayer = auction.poolPlayers.find(
//       (player) => player.playerId === processedApplication?.playerId
//     );
//     expect(poolPlayer?.playerId).toBe(application.playerId);
//     let toRegisterFranchise:CreateFranchiseApplicationDTO = {
//       franchiseId: newFranchise.id,
//       auctionId: auction.id,
//       purse: 100,
//       status:"pending"
//     };
//     let registeredFranchise = franchiseApplicationService.addOne(toRegisterFranchise)
//     expect(registeredFranchise?.purse).toBe(toRegisterFranchise.purse);
//     if (registeredFranchise) {
//     let newBiddingSession = auctionService.start(auction.id);

//     let newBidDTO: CreateBidDTO = {
//       franchiseId: registeredFranchise?.franchiseId,
//       biddingSessionId:newBiddingSession.id,
//       amount: 100,
//       auctionId: registeredFranchise.auctionId,
//       createdAt: Date.now(),
//     };

//     let newBid = auctionService.bid(newBidDTO)
//     let searchedBid = newBiddingSession.bids.find((bid)=>bid.amount === newBid.amount)
//     console.log(searchedBid);
    
//     expect(searchedBid?.amount).toBe(100)
    
//   }

//   });
//   it("should be able to stop the biddinsession and return winning bid if exist else start other round", () => {
//     let franchises = franchiseService.getAll();
//     expect(franchises).toHaveLength(0);
//     let franchise: CreateFranchiseDTO = {
//       name: "MI",
//       city: "Mumbai",
//     };
//     let newFranchise = franchiseService.addOne(franchise);
//     franchises = franchiseService.getAll();
//     expect(franchises).toHaveLength(1);
//     let thala: CreatePlayerDTO = {
//       dob: 2002,
//       name: "Mahi",
//       nationality: "indian",
//       skills: {
//         batter: 0,
//         bowler: 0,
//         allRounder: 0,
//         wicketKeeper: 1,
//       },
//     };
//     let newPlayer = playerService.addOne(thala);

//     let chiku: CreatePlayerDTO = {
//       dob: 2002,
//       name: "Chiku",
//       nationality: "indian",
//       skills: {
//         batter: 4,
//         bowler: 4,
//         allRounder: 4,
//         wicketKeeper: 1,
//       },
//     };
//     let newChiku = playerService.addOne(chiku);
   


//     let iplDTO = {
//       name: "IPL",
//     };
//     let league = leagueService.addOne(iplDTO);

//     let editionDTO: CreateEditionDTO = {
//       name: "TATA",
//       leagueId: league.id,
//     };
//     let edition = editionService.addOne(editionDTO);

//     let auctionDTO: CreateAuctionDTO = {
//       editionId: edition.id,
//       purse: 1000,
//       numberOfRounds: 3,
//       coolDownPeriod: 300, // in seconds
//       plannedStartDate: new Date().toDateString(),
//     };
//     let auction = auctionService.addOne(auctionDTO);

//     let applications = applicationService.getAll();
//     expect(applications).toHaveLength(0);
//     let application: CreatePlayerApplicationDTO = {
//       playerId: newPlayer.id,
//       auctionId: auction.id,
//       roundBasePrice: { 1: 100, 2: 40, 3: 10 },
//     };

//     let newApplication = applicationService.addOne(application);
//     applications = applicationService.getAll();

//     expect(applications).toHaveLength(1);
//     let currentApplication = applications.find(
//       (application) => application.id === newApplication.id
//     );
//     expect(currentApplication?.playerId).toBe(newPlayer.id);
//     let applicationMeta: PlayerApplicationMeta= {
//       authorizedOn: new Date().toDateString(),
//       authorizedBy: auction.id, // can be a league owner
//       comment: "approved",
//     };
  

//     if (!currentApplication) {
//       throw new Error("application not found");
//     }
//     let processedApplication = applicationService.process(
//       currentApplication,
//       applicationMeta,
//       "accepted",
//       auctionService
//     );
//     expect(processedApplication?.status).toBe("accepted");
//     let poolPlayer = auction.poolPlayers.find(
//       (player) => player.playerId === processedApplication?.playerId
//     );
//     expect(poolPlayer?.playerId).toBe(application.playerId);

//     let application2: CreatePlayerApplicationDTO = {
//       playerId: newChiku.id,
//       auctionId: auction.id,
//       roundBasePrice: { 1: 200, 2: 40, 3: 10 },
//     };

//     let newApplication2 = applicationService.addOne(application2);
  
//     applications = applicationService.getAll();

//     expect(applications).toHaveLength(2);
//     let currentApplication2 = applications.find(
//       (application) => application.id === newApplication.id
//     );
//     expect(currentApplication?.playerId).toBe(newPlayer.id);
//     let applicationMeta2: PlayerApplicationMeta= {
//       authorizedOn: new Date().toDateString(),
//       authorizedBy: auction.id, // can be a league owner
//       comment: "approved",
//     };
//     applicationService.process(newApplication2,applicationMeta2,"accepted",auctionService)


//     let toRegisterFranchise:CreateFranchiseApplicationDTO = {
//       franchiseId: newFranchise.id,
//       auctionId: auction.id,
//       purse: 100,
//       status:"pending"
//     };


//     let registeredFranchise = franchiseApplicationService.addOne(toRegisterFranchise)
//     expect(registeredFranchise?.purse).toBe(toRegisterFranchise.purse);
//     if (registeredFranchise) {
//     let newBiddingSession = auctionService.start(auction.id);

//     let newBidDTO: CreateBidDTO = {
//       franchiseId: registeredFranchise?.franchiseId,
//       biddingSessionId:newBiddingSession.id,
//       amount: 100,
//       auctionId: registeredFranchise.auctionId,
//       createdAt: Date.now(),
//     };

//     let newBid = auctionService.bid(newBidDTO)
//     let searchedBid = newBiddingSession.bids.find((bid)=>bid.amount === newBid.amount)

//     expect(searchedBid?.amount).toBe(100)

//     let franchise2: CreateFranchiseDTO = {
//       name: "CSK",
//       city: "Chennai",
//     };
//     let newFranchise2 = franchiseService.addOne(franchise2);
//     franchises = franchiseService.getAll();
//     expect(franchises).toHaveLength(2);
//     let toRegisterFranchise2:CreateFranchiseApplicationDTO = {
//       franchiseId: newFranchise2.id,
//       auctionId: auction.id,
//       purse: 100,
//       status:"pending"
//     };
//     let registeredFranchise2 = franchiseApplicationService.addOne(toRegisterFranchise2)
//     let meta = {
//       authorizedOn: new Date().toDateString(),
//       authorizedBy: auction.id,
//       comment: "approved",
//     };
//     franchiseApplicationService.process(registeredFranchise, meta, "accepted", auctionService)
//     franchiseApplicationService.process(registeredFranchise2,meta,"accepted",auctionService)
//     console.log(auction.registeredFranchises);
    
    
   

//     let newBidDTO2: CreateBidDTO = {
//       franchiseId: registeredFranchise2?.franchiseId,
//       biddingSessionId:newBiddingSession.id,
//       amount: 120,
//       auctionId: registeredFranchise2.auctionId,
//       createdAt: Date.now(),
//     };
    
//     let newBid2 = auctionService.bid(newBidDTO2)
//     let searchedBid2 = newBiddingSession.bids.find((bid)=>bid.amount === newBid2.amount)
    
//     auctionService.stopBiddingSession(newBiddingSession.id)
//     let winningBid = auctionService.getWinningBid(newBiddingSession.id)
//     expect(winningBid?.amount).toBe(120)
//     expect(auction.registeredFranchises[1].team[0]).toBe(newBiddingSession.playerId)
    
//   }

//   });
});
