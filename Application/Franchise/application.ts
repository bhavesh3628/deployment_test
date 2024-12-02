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

  async getAll() {
    return Promise.resolve(this.applications);
  }

  async addOne(application: CreateFranchiseApplicationDTO) {
    let applications = await this.getAll();
    let existingApplication = applications.find(
      (currentApplication) =>
        currentApplication.franchiseId === application.franchiseId &&
        currentApplication.auctionId === application.auctionId
    );
    if (!existingApplication) {
      let newApplication = new FranchiseApplication(application);
      this.applications = [...applications, newApplication];
      return Promise.resolve(newApplication);
    }
    return Promise.reject(
      "Application already exist for the auction, please edit it"
    );
  }

  async editOne(
    applicationId: number,
    editApplicationDTO: EditFranchiseApplicationDTO
  ) {
    let applications = await this.getAll();
    this.applications = applications.map((currentApplication) =>
      currentApplication.id === applicationId
        ? { ...currentApplication, ...editApplicationDTO }
        : currentApplication
    );

    let application = applications.find(
      (application) => application.id === applicationId
    );
    return Promise.resolve(application);
  }

  async deleteOne(applicationId: number) {
    let applications = await this.getAll();
    return Promise.resolve(
      (this.applications = applications.filter(
        (application) => application.id !== applicationId
      ))
    );
  }

  async process(
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
      return Promise.resolve(application);
    } else {
      return Promise.resolve(
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
