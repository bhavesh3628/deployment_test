import {
  FranchiseApplication,
  FranchiseApplicationService,
} from "../Application/Franchise/application";
import {
  CreateFranchiseApplicationDTO,
  FranchiseApplicationMeta,
} from "../Application/Franchise/types";
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
    let applicationMeta: PlayerApplicationMeta = {
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
    console.log(auction.poolPlayers);
    expect(poolPlayer?.playerId).toBe(application.playerId);
    let toRegisterFranchise: CreateFranchiseApplicationDTO = {
      franchiseId: newFranchise.id,
      auctionId: auction.id,
      purse: 100,
      status: "pending",
    };
    let registeredFranchise =
      franchiseApplicationService.addOne(toRegisterFranchise);
    let franchiseApplicationMeta: FranchiseApplicationMeta = {
      authorizedOn: new Date().toDateString(),
      authorizedBy: auction.id, // can be a league owner
      comment: "approved",
    };
    auctionService.processFranchiseApplication(
      registeredFranchise,
      franchiseApplicationMeta,
      "accepted"
    );
    console.log(auction.registeredFranchises);
    expect(registeredFranchise?.purse).toBe(toRegisterFranchise.purse);
    if (registeredFranchise) {
      let newBiddingSession = auctionService.start(auction.id);

      expect(newBiddingSession!.status).toBe("started");
    }
  });
  it("should be able to accept a bid", () => {
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
    let applicationMeta: PlayerApplicationMeta = {
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
    expect(poolPlayer?.playerId).toBe(application.playerId);
    let toRegisterFranchise: CreateFranchiseApplicationDTO = {
      franchiseId: newFranchise.id,
      auctionId: auction.id,
      purse: 100,
      status: "pending",
    };
    let registeredFranchise =
      franchiseApplicationService.addOne(toRegisterFranchise);
    expect(registeredFranchise?.purse).toBe(toRegisterFranchise.purse);
    if (registeredFranchise) {
      let newBiddingSession = auctionService.start(auction.id);
      let thalaBid: CreateBidDTO = {
        franchiseId: registeredFranchise.franchiseId,
        amount: 100,
        auctionId: auction.id,
        biddingSessionId: newBiddingSession.id,
        createdAt: Date.now(),
      };

      let miBid = auctionService.bid(thalaBid);
      let searchedBid = newBiddingSession.bids.find(
        (bid) => bid.id === miBid.id
      );
      expect(searchedBid?.amount).toBe(100);
    }
  });
  it("should be able to take and validate more than one bid", () => {
    let franchises = franchiseService.getAll();
    expect(franchises).toHaveLength(0);
    let mi: CreateFranchiseDTO = {
      name: "MI",
      city: "Mumbai",
    };
    let csk: CreateFranchiseDTO = {
      name: "CSK",
      city: "Chennai",
    };
    let rcb: CreateFranchiseDTO = {
      name: "RCB",
      city: "Bangalore",
    };
    let mumbaiIndians = franchiseService.addOne(mi);
    let chennaiSuperKings = franchiseService.addOne(csk);
    let royalChallengersBangalore = franchiseService.addOne(rcb);
    franchises = franchiseService.getAll();
    expect(franchises).toHaveLength(3);
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
    let applicationMeta: PlayerApplicationMeta = {
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
    expect(poolPlayer?.playerId).toBe(application.playerId);
    let miApplicationDTO: CreateFranchiseApplicationDTO = {
      franchiseId: mumbaiIndians.id,
      auctionId: auction.id,
      purse: 10000,
      status: "pending",
    };
    let cskApplicationDTO: CreateFranchiseApplicationDTO = {
      franchiseId: chennaiSuperKings.id,
      auctionId: auction.id,
      purse: 8000,
      status: "pending",
    };
    let rcbApplicationDTO: CreateFranchiseApplicationDTO = {
      franchiseId: royalChallengersBangalore.id,
      auctionId: auction.id,
      purse: 6000,
      status: "pending",
    };
    let miApplication = franchiseApplicationService.addOne(miApplicationDTO);
    let cskApplication = franchiseApplicationService.addOne(cskApplicationDTO);
    let rcbApplication = franchiseApplicationService.addOne(rcbApplicationDTO);
    expect(cskApplication?.purse).toBe(cskApplicationDTO.purse);
    expect(miApplication?.purse).toBe(miApplicationDTO.purse);
    expect(rcbApplication?.purse).toBe(rcbApplicationDTO.purse);
    let franchiseApplicationMeta: FranchiseApplicationMeta = {
      authorizedOn: new Date().toDateString(),
      authorizedBy: auction.id, // can be a league owner
      comment: "approved",
    };
    let approvedMIApplication = auctionService.processFranchiseApplication(
      miApplication,
      franchiseApplicationMeta,
      "accepted"
    );
    let approvedCSKApplication = auctionService.processFranchiseApplication(
      cskApplication,
      franchiseApplicationMeta,
      "accepted"
    );
    let approvedRCBApplication = auctionService.processFranchiseApplication(
      rcbApplication,
      franchiseApplicationMeta,
      "accepted"
    );
    let newBiddingSession = auctionService.start(auction.id);
    let thalaBid: CreateBidDTO = {
      franchiseId: auctionService.getRegisteredFranchise(
        approvedMIApplication.auctionId,
        approvedMIApplication.franchiseId
      ).id,
      amount: 80,
      auctionId: auction.id,
      biddingSessionId: newBiddingSession.id,
      createdAt: Date.now(),
    };
    let thalaBid2: CreateBidDTO = {
      franchiseId: auctionService.getRegisteredFranchise(
        approvedCSKApplication.auctionId,
        approvedCSKApplication.franchiseId
      ).id,
      amount: 150,
      auctionId: auction.id,
      biddingSessionId: newBiddingSession.id,
      createdAt: Date.now(),
    };
    let thalaBid3: CreateBidDTO = {
      franchiseId: auctionService.getRegisteredFranchise(
        approvedRCBApplication.auctionId,
        approvedRCBApplication.franchiseId
      ).id,
      amount: 100,
      auctionId: auction.id,
      biddingSessionId: newBiddingSession.id,
      createdAt: Date.now(),
    };

    let miBid = auctionService.bid(thalaBid);
    let cskBid = auctionService.bid(thalaBid2);
    let rcbBid = auctionService.bid(thalaBid3);
    let searchedBid = newBiddingSession.bids.find(
      (bid) => bid.id === cskBid.id
    );
    console.log(newBiddingSession.bids);
    expect(newBiddingSession.bids).toHaveLength(1);
    expect(searchedBid?.amount).toBe(150);
  });

  it("should be able to stop bidding session and assign player to winning bid franchise", () => {
    let franchises = franchiseService.getAll();
    expect(franchises).toHaveLength(0);
    let mi: CreateFranchiseDTO = {
      name: "MI",
      city: "Mumbai",
    };
    let csk: CreateFranchiseDTO = {
      name: "CSK",
      city: "Chennai",
    };
    let rcb: CreateFranchiseDTO = {
      name: "RCB",
      city: "Bangalore",
    };
    let mumbaiIndians = franchiseService.addOne(mi);
    let chennaiSuperKings = franchiseService.addOne(csk);
    let royalChallengersBangalore = franchiseService.addOne(rcb);
    franchises = franchiseService.getAll();
    expect(franchises).toHaveLength(3);
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
    let rohit: CreatePlayerDTO = {
      dob: 2002,
      name: "Rohit",
      nationality: "indian",
      skills: {
        batter: 1,
        bowler: 0,
        allRounder: 0,
        wicketKeeper: 0,
      },
    };
    let malinga: CreatePlayerDTO = {
      dob: 2002,
      name: "malinga",
      nationality: "sri lankan",
      skills: {
        batter: 0,
        bowler: 1,
        allRounder: 0,
        wicketKeeper: 0,
      },
    };

    let dhoni = playerService.addOne(thala);
    let sharma = playerService.addOne(rohit);
    let lasith = playerService.addOne(malinga);
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
    let dhoniApplicationDTO: CreatePlayerApplicationDTO = {
      playerId: dhoni.id,
      auctionId: auction.id,
      roundBasePrice: { 1: 100, 2: 40, 3: 10 },
    };
    let rohitApplicationDTO: CreatePlayerApplicationDTO = {
      playerId: sharma.id,
      auctionId: auction.id,
      roundBasePrice: { 1: 120, 2: 60, 3: 20 },
    };
    let malingaApplicationDTO: CreatePlayerApplicationDTO = {
      playerId: lasith.id,
      auctionId: auction.id,
      roundBasePrice: { 1: 150, 2: 70, 3: 30 },
    };
    let dhoniApplication = applicationService.addOne(dhoniApplicationDTO);
    let rohitApplication = applicationService.addOne(rohitApplicationDTO);
    let malingaApplication = applicationService.addOne(malingaApplicationDTO);
    applications = applicationService.getAll();

    expect(applications).toHaveLength(3);

    let applicationMeta: PlayerApplicationMeta = {
      authorizedOn: new Date().toDateString(),
      authorizedBy: auction.id, // can be a league owner
      comment: "approved",
    };

    let processedDhoniApplication = applicationService.process(
      dhoniApplication,
      applicationMeta,
      "accepted",
      auctionService
    );
    let processedRohitApplication = applicationService.process(
      rohitApplication,
      applicationMeta,
      "accepted",
      auctionService
    );
    let processedMalingaApplication = applicationService.process(
      malingaApplication,
      applicationMeta,
      "accepted",
      auctionService
    );
    let registeredDhoni = auctionService.getPoolPlayer(
      auction.id,
      processedDhoniApplication.playerId
    );
    let registeredRohit = auctionService.getPoolPlayer(
      auction.id,
      processedRohitApplication.playerId
    );
    let registeredMalinga = auctionService.getPoolPlayer(
      auction.id,
      processedMalingaApplication.playerId
    );
    let miApplicationDTO: CreateFranchiseApplicationDTO = {
      franchiseId: mumbaiIndians.id,
      auctionId: auction.id,
      purse: 10000,
      status: "pending",
    };
    let cskApplicationDTO: CreateFranchiseApplicationDTO = {
      franchiseId: chennaiSuperKings.id,
      auctionId: auction.id,
      purse: 8000,
      status: "pending",
    };
    let rcbApplicationDTO: CreateFranchiseApplicationDTO = {
      franchiseId: royalChallengersBangalore.id,
      auctionId: auction.id,
      purse: 6000,
      status: "pending",
    };
    let miApplication = franchiseApplicationService.addOne(miApplicationDTO);
    let cskApplication = franchiseApplicationService.addOne(cskApplicationDTO);
    let rcbApplication = franchiseApplicationService.addOne(rcbApplicationDTO);
    expect(cskApplication?.purse).toBe(cskApplicationDTO.purse);
    expect(miApplication?.purse).toBe(miApplicationDTO.purse);
    expect(rcbApplication?.purse).toBe(rcbApplicationDTO.purse);
    let franchiseApplicationMeta: FranchiseApplicationMeta = {
      authorizedOn: new Date().toDateString(),
      authorizedBy: auction.id, // can be a league owner
      comment: "approved",
    };
    let approvedMIApplication = auctionService.processFranchiseApplication(
      miApplication,
      franchiseApplicationMeta,
      "accepted"
    );
    let approvedCSKApplication = auctionService.processFranchiseApplication(
      cskApplication,
      franchiseApplicationMeta,
      "accepted"
    );
    let approvedRCBApplication = auctionService.processFranchiseApplication(
      rcbApplication,
      franchiseApplicationMeta,
      "accepted"
    );
    let newBiddingSession = auctionService.start(auction.id);

    let thalaBid: CreateBidDTO = {
      franchiseId: auctionService.getRegisteredFranchise(
        approvedMIApplication.auctionId,
        approvedMIApplication.franchiseId
      ).franchiseId,
      amount: 200,
      auctionId: auction.id,
      biddingSessionId: newBiddingSession.id,
      createdAt: Date.now(),
    };
    let thalaBid2: CreateBidDTO = {
      franchiseId: auctionService.getRegisteredFranchise(
        approvedCSKApplication.auctionId,
        approvedCSKApplication.franchiseId
      ).franchiseId,
      amount: 250,
      auctionId: auction.id,
      biddingSessionId: newBiddingSession.id,
      createdAt: Date.now(),
    };
    let thalaBid3: CreateBidDTO = {
      franchiseId: auctionService.getRegisteredFranchise(
        approvedRCBApplication.auctionId,
        approvedRCBApplication.franchiseId
      ).franchiseId,
      amount: 300,
      auctionId: auction.id,
      biddingSessionId: newBiddingSession.id,
      createdAt: Date.now(),
    };

    let miBid = auctionService.bid(thalaBid);
    let cskBid = auctionService.bid(thalaBid2);
    let rcbBid = auctionService.bid(thalaBid3);

    expect(newBiddingSession.bids).toHaveLength(3);

    let nextBiddingSession = auctionService.stopSession(newBiddingSession);
    let winningBid = auctionService.getWinningBid(newBiddingSession.id);
    expect(winningBid.amount).toBe(rcbBid.amount);

    let winningFranchise = auctionService.getRegisteredFranchise(
      auction.id,
      winningBid.franchiseId
    );
    expect(winningFranchise.purse).toBe(5700);
    expect(winningFranchise.team).toHaveLength(1);
    expect(winningFranchise.team.includes(registeredDhoni.id));
    console.log(newBiddingSession.playerId, newBiddingSession.status);
    console.log(nextBiddingSession?.playerId, nextBiddingSession?.status);
  });

  it("should be able to end auction", () => {
    let franchises = franchiseService.getAll();
    expect(franchises).toHaveLength(0);
    let mi: CreateFranchiseDTO = {
      name: "MI",
      city: "Mumbai",
    };
    let csk: CreateFranchiseDTO = {
      name: "CSK",
      city: "Chennai",
    };
    let rcb: CreateFranchiseDTO = {
      name: "RCB",
      city: "Bangalore",
    };
    let mumbaiIndians = franchiseService.addOne(mi);
    let chennaiSuperKings = franchiseService.addOne(csk);
    let royalChallengersBangalore = franchiseService.addOne(rcb);
    franchises = franchiseService.getAll();
    expect(franchises).toHaveLength(3);
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
    let rohit: CreatePlayerDTO = {
      dob: 2002,
      name: "Rohit",
      nationality: "indian",
      skills: {
        batter: 1,
        bowler: 0,
        allRounder: 0,
        wicketKeeper: 0,
      },
    };
    let malinga: CreatePlayerDTO = {
      dob: 2002,
      name: "malinga",
      nationality: "sri lankan",
      skills: {
        batter: 0,
        bowler: 1,
        allRounder: 0,
        wicketKeeper: 0,
      },
    };

    let dhoni = playerService.addOne(thala);
    let sharma = playerService.addOne(rohit);
    let lasith = playerService.addOne(malinga);
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
    let dhoniApplicationDTO: CreatePlayerApplicationDTO = {
      playerId: dhoni.id,
      auctionId: auction.id,
      roundBasePrice: { 1: 100, 2: 40, 3: 10 },
    };
    let rohitApplicationDTO: CreatePlayerApplicationDTO = {
      playerId: sharma.id,
      auctionId: auction.id,
      roundBasePrice: { 1: 120, 2: 60, 3: 20 },
    };
    let malingaApplicationDTO: CreatePlayerApplicationDTO = {
      playerId: lasith.id,
      auctionId: auction.id,
      roundBasePrice: { 1: 150, 2: 70, 3: 30 },
    };
    let dhoniApplication = applicationService.addOne(dhoniApplicationDTO);
    let rohitApplication = applicationService.addOne(rohitApplicationDTO);
    let malingaApplication = applicationService.addOne(malingaApplicationDTO);
    applications = applicationService.getAll();

    expect(applications).toHaveLength(3);

    let applicationMeta: PlayerApplicationMeta = {
      authorizedOn: new Date().toDateString(),
      authorizedBy: auction.id, // can be a league owner
      comment: "approved",
    };

    let processedDhoniApplication = applicationService.process(
      dhoniApplication,
      applicationMeta,
      "accepted",
      auctionService
    );
    // let processedRohitApplication = applicationService.process(
    //   rohitApplication,
    //   applicationMeta,
    //   "accepted",
    //   auctionService
    // );
    // let processedMalingaApplication = applicationService.process(
    //   malingaApplication,
    //   applicationMeta,
    //   "accepted",
    //   auctionService
    // );
    let registeredDhoni = auctionService.getPoolPlayer(
      auction.id,
      processedDhoniApplication.playerId
    );
    // let registeredRohit = auctionService.getPoolPlayer(
    //   auction.id,
    //   processedRohitApplication.playerId
    // );
    // let registeredMalinga = auctionService.getPoolPlayer(
    //   auction.id,
    //   processedMalingaApplication.playerId
    // );
    let miApplicationDTO: CreateFranchiseApplicationDTO = {
      franchiseId: mumbaiIndians.id,
      auctionId: auction.id,
      purse: 10000,
      status: "pending",
    };
    let cskApplicationDTO: CreateFranchiseApplicationDTO = {
      franchiseId: chennaiSuperKings.id,
      auctionId: auction.id,
      purse: 8000,
      status: "pending",
    };
    let rcbApplicationDTO: CreateFranchiseApplicationDTO = {
      franchiseId: royalChallengersBangalore.id,
      auctionId: auction.id,
      purse: 6000,
      status: "pending",
    };
    let miApplication = franchiseApplicationService.addOne(miApplicationDTO);
    let cskApplication = franchiseApplicationService.addOne(cskApplicationDTO);
    let rcbApplication = franchiseApplicationService.addOne(rcbApplicationDTO);
    expect(cskApplication?.purse).toBe(cskApplicationDTO.purse);
    expect(miApplication?.purse).toBe(miApplicationDTO.purse);
    expect(rcbApplication?.purse).toBe(rcbApplicationDTO.purse);
    let franchiseApplicationMeta: FranchiseApplicationMeta = {
      authorizedOn: new Date().toDateString(),
      authorizedBy: auction.id, // can be a league owner
      comment: "approved",
    };
    let approvedMIApplication = auctionService.processFranchiseApplication(
      miApplication,
      franchiseApplicationMeta,
      "accepted"
    );
    let approvedCSKApplication = auctionService.processFranchiseApplication(
      cskApplication,
      franchiseApplicationMeta,
      "accepted"
    );
    let approvedRCBApplication = auctionService.processFranchiseApplication(
      rcbApplication,
      franchiseApplicationMeta,
      "accepted"
    );
    let newBiddingSession = auctionService.start(auction.id);

    let thalaBid: CreateBidDTO = {
      franchiseId: auctionService.getRegisteredFranchise(
        approvedMIApplication.auctionId,
        approvedMIApplication.franchiseId
      ).franchiseId,
      amount: 200,
      auctionId: auction.id,
      biddingSessionId: newBiddingSession.id,
      createdAt: Date.now(),
    };
    let thalaBid2: CreateBidDTO = {
      franchiseId: auctionService.getRegisteredFranchise(
        approvedCSKApplication.auctionId,
        approvedCSKApplication.franchiseId
      ).franchiseId,
      amount: 250,
      auctionId: auction.id,
      biddingSessionId: newBiddingSession.id,
      createdAt: Date.now(),
    };
    let thalaBid3: CreateBidDTO = {
      franchiseId: auctionService.getRegisteredFranchise(
        approvedRCBApplication.auctionId,
        approvedRCBApplication.franchiseId
      ).franchiseId,
      amount: 300,
      auctionId: auction.id,
      biddingSessionId: newBiddingSession.id,
      createdAt: Date.now(),
    };

    let miBid = auctionService.bid(thalaBid);
    let cskBid = auctionService.bid(thalaBid2);
    let rcbBid = auctionService.bid(thalaBid3);

    expect(newBiddingSession.bids).toHaveLength(3);

    let nextBiddingSession = auctionService.stopSession(newBiddingSession);
    let winningBid = auctionService.getWinningBid(newBiddingSession.id);
    expect(winningBid.amount).toBe(rcbBid.amount);

    let winningFranchise = auctionService.getRegisteredFranchise(
      auction.id,
      winningBid.franchiseId
    );
    expect(winningFranchise.purse).toBe(5700);
    expect(winningFranchise.team).toHaveLength(1);
    expect(winningFranchise.team.includes(registeredDhoni.id));

    auctionService.stopAuction(auction.id);
    expect(auction.status).toBe("concluded");
  });
  // it("should be able to end auction", () => {
  //   let franchises = franchiseService.getAll();
  //   expect(franchises).toHaveLength(0);
  //   let mi: CreateFranchiseDTO = {
  //     name: "MI",
  //     city: "Mumbai",
  //   };
  //   let csk: CreateFranchiseDTO = {
  //     name: "CSK",
  //     city: "Chennai",
  //   };
  //   let rcb: CreateFranchiseDTO = {
  //     name: "RCB",
  //     city: "Bangalore",
  //   };
  //   let mumbaiIndians = franchiseService.addOne(mi);
  //   let chennaiSuperKings = franchiseService.addOne(csk);
  //   let royalChallengersBangalore = franchiseService.addOne(rcb);
  //   franchises = franchiseService.getAll();
  //   expect(franchises).toHaveLength(3);
  //   let thala: CreatePlayerDTO = {
  //     dob: 2002,
  //     name: "Mahi",
  //     nationality: "indian",
  //     skills: {
  //       batter: 0,
  //       bowler: 0,
  //       allRounder: 0,
  //       wicketKeeper: 1,
  //     },
  //   };
  //   let rohit: CreatePlayerDTO = {
  //     dob: 2002,
  //     name: "Rohit",
  //     nationality: "indian",
  //     skills: {
  //       batter: 1,
  //       bowler: 0,
  //       allRounder: 0,
  //       wicketKeeper: 0,
  //     },
  //   };
  //   let malinga: CreatePlayerDTO = {
  //     dob: 2002,
  //     name: "malinga",
  //     nationality: "sri lankan",
  //     skills: {
  //       batter: 0,
  //       bowler: 1,
  //       allRounder: 0,
  //       wicketKeeper: 0,
  //     },
  //   };

  //   let dhoni = playerService.addOne(thala);
  //   let sharma = playerService.addOne(rohit);
  //   let lasith = playerService.addOne(malinga);
  //   let iplDTO = {
  //     name: "IPL",
  //   };
  //   let league = leagueService.addOne(iplDTO);

  //   let editionDTO: CreateEditionDTO = {
  //     name: "TATA",
  //     leagueId: league.id,
  //   };
  //   let edition = editionService.addOne(editionDTO);

  //   let auctionDTO: CreateAuctionDTO = {
  //     editionId: edition.id,
  //     purse: 1000,
  //     numberOfRounds: 3,
  //     coolDownPeriod: 300, // in seconds
  //     plannedStartDate: new Date().toDateString(),
  //   };
  //   let auction = auctionService.addOne(auctionDTO);

  //   let applications = applicationService.getAll();
  //   expect(applications).toHaveLength(0);
  //   let dhoniApplicationDTO: CreatePlayerApplicationDTO = {
  //     playerId: dhoni.id,
  //     auctionId: auction.id,
  //     roundBasePrice: { 1: 100, 2: 40, 3: 10 },
  //   };
  //   let rohitApplicationDTO: CreatePlayerApplicationDTO = {
  //     playerId: sharma.id,
  //     auctionId: auction.id,
  //     roundBasePrice: { 1: 120, 2: 60, 3: 20 },
  //   };
  //   let malingaApplicationDTO: CreatePlayerApplicationDTO = {
  //     playerId: lasith.id,
  //     auctionId: auction.id,
  //     roundBasePrice: { 1: 150, 2: 70, 3: 30 },
  //   };
  //   let dhoniApplication = applicationService.addOne(dhoniApplicationDTO);
  //   let rohitApplication = applicationService.addOne(rohitApplicationDTO);
  //   let malingaApplication = applicationService.addOne(malingaApplicationDTO);
  //   applications = applicationService.getAll();

  //   expect(applications).toHaveLength(3);

  //   let applicationMeta: PlayerApplicationMeta = {
  //     authorizedOn: new Date().toDateString(),
  //     authorizedBy: auction.id, // can be a league owner
  //     comment: "approved",
  //   };

  //   let processedDhoniApplication = applicationService.process(
  //     dhoniApplication,
  //     applicationMeta,
  //     "accepted",
  //     auctionService
  //   );
  //   let processedRohitApplication = applicationService.process(
  //     rohitApplication,
  //     applicationMeta,
  //     "accepted",
  //     auctionService
  //   );
  //   // let processedMalingaApplication = applicationService.process(
  //   //   malingaApplication,
  //   //   applicationMeta,
  //   //   "accepted",
  //   //   auctionService
  //   // );
  //   let registeredDhoni = auctionService.getPoolPlayer(
  //     auction.id,
  //     processedDhoniApplication.playerId
  //   );
  //   let registeredRohit = auctionService.getPoolPlayer(
  //     auction.id,
  //     processedRohitApplication.playerId
  //   );
  //   // let registeredMalinga = auctionService.getPoolPlayer(
  //   //   auction.id,
  //   //   processedMalingaApplication.playerId
  //   // );
  //   let miApplicationDTO: CreateFranchiseApplicationDTO = {
  //     franchiseId: mumbaiIndians.id,
  //     auctionId: auction.id,
  //     purse: 10000,
  //     status: "pending",
  //   };
  //   let cskApplicationDTO: CreateFranchiseApplicationDTO = {
  //     franchiseId: chennaiSuperKings.id,
  //     auctionId: auction.id,
  //     purse: 8000,
  //     status: "pending",
  //   };
  //   let rcbApplicationDTO: CreateFranchiseApplicationDTO = {
  //     franchiseId: royalChallengersBangalore.id,
  //     auctionId: auction.id,
  //     purse: 6000,
  //     status: "pending",
  //   };
  //   let miApplication = franchiseApplicationService.addOne(miApplicationDTO);
  //   let cskApplication = franchiseApplicationService.addOne(cskApplicationDTO);
  //   let rcbApplication = franchiseApplicationService.addOne(rcbApplicationDTO);
  //   expect(cskApplication?.purse).toBe(cskApplicationDTO.purse);
  //   expect(miApplication?.purse).toBe(miApplicationDTO.purse);
  //   expect(rcbApplication?.purse).toBe(rcbApplicationDTO.purse);
  //   let franchiseApplicationMeta: FranchiseApplicationMeta = {
  //     authorizedOn: new Date().toDateString(),
  //     authorizedBy: auction.id, // can be a league owner
  //     comment: "approved",
  //   };
  //   let approvedMIApplication = auctionService.processFranchiseApplication(
  //     miApplication,
  //     franchiseApplicationMeta,
  //     "accepted"
  //   );
  //   let approvedCSKApplication = auctionService.processFranchiseApplication(
  //     cskApplication,
  //     franchiseApplicationMeta,
  //     "accepted"
  //   );
  //   let approvedRCBApplication = auctionService.processFranchiseApplication(
  //     rcbApplication,
  //     franchiseApplicationMeta,
  //     "accepted"
  //   );
  //   let newBiddingSession = auctionService.start(auction.id);

  //   let thalaBid: CreateBidDTO = {
  //     franchiseId: auctionService.getRegisteredFranchise(
  //       approvedMIApplication.auctionId,
  //       approvedMIApplication.franchiseId
  //     ).franchiseId,
  //     amount: 200,
  //     auctionId: auction.id,
  //     biddingSessionId: newBiddingSession.id,
  //     createdAt: Date.now(),
  //   };
  //   let thalaBid2: CreateBidDTO = {
  //     franchiseId: auctionService.getRegisteredFranchise(
  //       approvedCSKApplication.auctionId,
  //       approvedCSKApplication.franchiseId
  //     ).franchiseId,
  //     amount: 250,
  //     auctionId: auction.id,
  //     biddingSessionId: newBiddingSession.id,
  //     createdAt: Date.now(),
  //   };
  //   let thalaBid3: CreateBidDTO = {
  //     franchiseId: auctionService.getRegisteredFranchise(
  //       approvedRCBApplication.auctionId,
  //       approvedRCBApplication.franchiseId
  //     ).franchiseId,
  //     amount: 300,
  //     auctionId: auction.id,
  //     biddingSessionId: newBiddingSession.id,
  //     createdAt: Date.now(),
  //   };

  //   let miBid = auctionService.bid(thalaBid);
  //   let cskBid = auctionService.bid(thalaBid2);
  //   let rcbBid = auctionService.bid(thalaBid3);

  //   expect(newBiddingSession.bids).toHaveLength(3);

  //   let nextBiddingSession = auctionService.stopSession(newBiddingSession);
  //   let winningBid = auctionService.getWinningBid(newBiddingSession.id);
  //   expect(winningBid.amount).toBe(rcbBid.amount);

  //   let winningFranchise = auctionService.getRegisteredFranchise(
  //     auction.id,
  //     winningBid.franchiseId
  //   );
  //   expect(winningFranchise.purse).toBe(5700);
  //   expect(winningFranchise.team).toHaveLength(1);
  //   expect(winningFranchise.team.includes(registeredDhoni.id));
  //   let rohitBid1: CreateBidDTO = {
  //     franchiseId: auctionService.getRegisteredFranchise(
  //       approvedMIApplication.auctionId,
  //       approvedMIApplication.franchiseId
  //     ).franchiseId,
  //     amount: 200,
  //     auctionId: auction.id,
  //     biddingSessionId: nextBiddingSession!.id,
  //     createdAt: Date.now(),
  //   };
  //   let rohitBid2: CreateBidDTO = {
  //     franchiseId: auctionService.getRegisteredFranchise(
  //       approvedMIApplication.auctionId,
  //       approvedMIApplication.franchiseId
  //     ).franchiseId,
  //     amount: 300,
  //     auctionId: auction.id,
  //     biddingSessionId: nextBiddingSession!.id,
  //     createdAt: Date.now(),
  //   };
  //   let rohitBid3: CreateBidDTO = {
  //     franchiseId: auctionService.getRegisteredFranchise(
  //       approvedMIApplication.auctionId,
  //       approvedMIApplication.franchiseId
  //     ).franchiseId,
  //     amount: 400,
  //     auctionId: auction.id,
  //     biddingSessionId: nextBiddingSession!.id,
  //     createdAt: Date.now(),
  //   };
  //   let miBid2 = auctionService.bid(rohitBid1);
  //   let cskBid2 = auctionService.bid(rohitBid2);
  //   let rcbBid2 = auctionService.bid(rohitBid3);
  //   expect(newBiddingSession.bids).toHaveLength(3);

  //   let nextBiddingSession2 = auctionService.stopSession(nextBiddingSession!);
  //   let winningBid2 = auctionService.getWinningBid(newBiddingSession.id);
  //   expect(winningBid.amount).toBe(rcbBid.amount);

  //   let winningFranchise2 = auctionService.getRegisteredFranchise(
  //     auction.id,
  //     winningBid.franchiseId
  //   );
  //   expect(winningFranchise2.purse).toBe(5300);
  //   expect(winningFranchise2.team).toHaveLength(2);
  //   expect(winningFranchise2.team.includes(registeredRohit.id));
  //   auctionService.stopAuction(auction.id);
  //   expect(auction.status).toBe("concluded");

  // });
});
