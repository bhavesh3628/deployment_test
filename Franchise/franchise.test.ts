import { FranchiseService } from "./Franchise";
import { CreateFranchiseDTO, EditFranchiseDTO } from "../Franchise/Types";
import {
  PlayerApplicationMeta,
  EditPlayerApplicationDTO,
} from "../Application/Player/types";
import { AuctionService } from "../Auction/Auction";
import { EditionService } from "../Edition/editionService";
import { LeagueService } from "../League/leagueService";
import { CreateEditionDTO } from "../Edition/Types";
import { CreateAuctionDTO } from "../Auction/Types";
import { RegisteredFranchise } from "../Auction/RegisteredFranchise/RegisteredFranchise";
import { CreateRegisteredFranchiseDTO } from "../Auction/RegisteredFranchise/types";
import { FranchiseApplicationService } from "../Application/Franchise/application";
import { CreateFranchiseApplicationDTO } from "../Application/Franchise/types";

describe("franchise", () => {
  let franchiseService: FranchiseService;
  let auctionService: AuctionService;
  let editionService: EditionService;
  let leagueService: LeagueService;
  let franchiseApplicationService: FranchiseApplicationService;

  beforeEach(() => {
    franchiseService = new FranchiseService();
    auctionService = new AuctionService();
    editionService = new EditionService();
    leagueService = new LeagueService();
    franchiseApplicationService = new FranchiseApplicationService();
  });

  it("should have no franchise at the start", () => {
    let franchises = franchiseService.getAll();
    expect(franchises).toHaveLength(0);
  });

  it("should add one franchise", () => {
    let franchises = franchiseService.getAll();
    expect(franchises).toHaveLength(0);
    let franchise: CreateFranchiseDTO = {
      name: "MI",
      city: "Mumbai",
    };
    let newFranchise = franchiseService.addOne(franchise);
    franchises = franchiseService.getAll();
    expect(franchises).toHaveLength(1);
  });

  it("should edit one franchise", () => {
    let franchises = franchiseService.getAll();
    expect(franchises).toHaveLength(0);
    let franchise: CreateFranchiseDTO = {
      name: "MI",
      city: "Mumbai",
    };
    let newFranchise = franchiseService.addOne(franchise);
    franchises = franchiseService.getAll();
    expect(franchises).toHaveLength(1);

    let editFranchiseDTO: EditFranchiseDTO = {
      name: "Mumbai Indians",
    };

    franchiseService.editOne(newFranchise.id, editFranchiseDTO);
    franchises = franchiseService.getAll();
    let editedFranchise = franchises.find(
      (franchise) => franchise.id === newFranchise.id
    );
    expect(editedFranchise?.name).toBe("Mumbai Indians");
  });

  it("should delete one franchise", () => {
    let franchises = franchiseService.getAll();
    expect(franchises).toHaveLength(0);
    let franchise: CreateFranchiseDTO = {
      name: "MI",
      city: "Mumbai",
    };
    let newFranchise = franchiseService.addOne(franchise);
    franchises = franchiseService.getAll();
    expect(franchises).toHaveLength(1);

    franchiseService.deleteOne(newFranchise.id);
    franchises = franchiseService.getAll();
    expect(franchises).toHaveLength(0);
  });

  it("should register for an auction", () => {
    let franchises = franchiseService.getAll();
    expect(franchises).toHaveLength(0);
    let franchise: CreateFranchiseDTO = {
      name: "MI",
      city: "Mumbai",
    };
    let newFranchise = franchiseService.addOne(franchise);
    franchises = franchiseService.getAll();
    expect(franchises).toHaveLength(1);

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
    let franchiseApplicationDTO: CreateFranchiseApplicationDTO = {
      franchiseId: newFranchise.id,
      auctionId: auction.id,
      purse: 100,
      status: "pending",
    };
    let applicationMeta: PlayerApplicationMeta = {
      authorizedOn: new Date().toDateString(),
      authorizedBy: auction.id, // can be a league owner
      comment: "approved",
    };
    let franchiseApplication = franchiseApplicationService.addOne(
      franchiseApplicationDTO
    );
    franchiseApplicationService.process(
      franchiseApplication,
      applicationMeta,
      "accepted",
      auctionService
    );
    let registeredFranchise = auction.registeredFranchises.find(
      (franchise) => franchise.franchiseId === newFranchise.id
    );
    expect(registeredFranchise?.purse).toBe(franchiseApplicationDTO.purse);
  });
});
