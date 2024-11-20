import { Auction, AuctionService } from "../../Auction/Auction";
import { RegisteredFranchise } from "../../Auction/RegisteredFranchise/RegisteredFranchise";
import { CreateRegisteredFranchiseDTO } from "../../Auction/RegisteredFranchise/types";
import { ApprovedPlayer, PlayerService } from "../../Players/playerService";
import { CreateApprovedPlayerDTO } from "../../Players/Types";
import {
  FranchiseApplicationMeta,
  CreateFranchiseApplicationDTO,
  EditFranchiseApplicationDTO,
  Status,
} from "./types";

export class FranchiseApplicationService {
  private applications: FranchiseApplication[];

  constructor() {
    this.applications = [];
  }

  getAll() {
    return this.applications;
  }

  addOne(application: CreateFranchiseApplicationDTO) {
    let existingApplication = this.applications.find(
      (currentApplication) =>
        currentApplication.franchiseId === application.franchiseId &&
        currentApplication.auctionId === application.auctionId
    );
    if (!existingApplication) {
      let newApplication = new FranchiseApplication(application);
      this.applications = [...this.applications, newApplication];
      return newApplication;
    }
    throw new Error(
      "Application already exist for the auction, please edit it"
    );
  }

  editOne(
    applicationId: number,
    editApplicationDTO: EditFranchiseApplicationDTO
  ) {
    this.applications = this.applications.map((currentApplication) =>
      currentApplication.id === applicationId
        ? { ...currentApplication, ...editApplicationDTO }
        : currentApplication
    );

    let application = this.applications.find(
      (application) => application.id === applicationId
    );
    return application;
  }

  deleteOne(applicationId: number) {
    return (this.applications = this.applications.filter(
      (application) => application.id !== applicationId
    ));
  }

  process(
    application: FranchiseApplication,
    meta: FranchiseApplicationMeta,
    status: Status,
    auctionService: AuctionService
  ) {
    application.applicationMeta = meta;
    application.status = status;
    if (application.status === "accepted") {
      let approvedFranchiseDTO: CreateRegisteredFranchiseDTO = {
        franchiseId: application.franchiseId,
        auctionId: application.auctionId,
        purse: application.purse,
      };
      let approvedFranchise = new RegisteredFranchise(approvedFranchiseDTO);
      auctionService.addToRegisteredFranchise(approvedFranchise);
      return application;
    } else {
      console.log(
        "please review your application according to rules of auction"
      );
    }
  }
}

export class FranchiseApplication {
  private static counter: number = 0;
  public readonly id: number;
  public readonly franchiseId: number;
  public readonly auctionId: number;
  public status: Status;
  public purse: number;
  public applicationMeta?: FranchiseApplicationMeta;

  constructor(application: CreateFranchiseApplicationDTO) {
    FranchiseApplication.counter += 1;
    this.id = FranchiseApplication.counter;
    this.auctionId = application.auctionId;
    this.franchiseId = application.franchiseId;
    this.status = "pending";
    this.purse = application.purse;
  }
}
