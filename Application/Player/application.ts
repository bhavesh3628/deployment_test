import { Auction, AuctionService } from "../../Auction/Auction";
import { ApprovedPlayer, PlayerService } from "../../Players/playerService";
import { CreateApprovedPlayerDTO } from "../../Players/Types";
import {
  PlayerApplicationMeta,
  CreatePlayerApplicationDTO,
  EditPlayerApplicationDTO,
  Status,
} from "./types";

export class PlayerApplicationService {
  private applications: PlayerApplication[];

  constructor() {
    this.applications = [];
  }

  async getAll() {
    return Promise.resolve(this.applications);
  }

  async addOne(application: CreatePlayerApplicationDTO) {
    let applications = await this.getAll();
    let existingApplication = applications.find(
      (currentApplication) =>
        currentApplication.playerId === application.playerId &&
        currentApplication.auctionId === application.auctionId
    );
    if (!existingApplication) {
      let newApplication = new PlayerApplication(application);
      this.applications = [...applications, newApplication];
      return Promise.resolve(newApplication);
    }
    return Promise.reject(
      "Application already exist for the auction, please edit it"
    );
  }

  async editOne(
    applicationId: number,
    editApplicationDTO: EditPlayerApplicationDTO
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
    application: PlayerApplication,
    meta: PlayerApplicationMeta,
    status: Status,
    auctionService: AuctionService
  ) {
    application.applicationMeta = meta;
    application.status = status;
    if (application.status === "accepted") {
      let approvedPlayerDTO: CreateApprovedPlayerDTO = {
        playerId: application.playerId,
        auctionId: application.auctionId,
        roundBasePrice: application.roundBasePrice,
      };
      let approvedPlayer = new ApprovedPlayer(approvedPlayerDTO);
      auctionService.addToPlayerPool(approvedPlayer);
      return Promise.resolve(application);
    } else {
      return Promise.reject(
        "please review your application according to rules of auction"
      );
      // return application;
    }
  }
}

export class PlayerApplication {
  private static counter: number = 0;
  public readonly id: number;
  public readonly playerId: number;
  public readonly auctionId: number;
  public status: Status;
  public roundBasePrice: { [key: number]: number };
  public applicationMeta?: PlayerApplicationMeta;

  constructor(application: CreatePlayerApplicationDTO) {
    PlayerApplication.counter += 1;
    this.id = PlayerApplication.counter;
    this.auctionId = application.auctionId;
    this.playerId = application.playerId;
    this.status = "pending";
    this.roundBasePrice = application.roundBasePrice;
  }
}
