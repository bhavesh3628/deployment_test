import axios from "axios";
// import { ApprovedPlayer } from "../../Players/playerService";
import {
  PlayerApplicationMeta,
  CreatePlayerApplicationDTO,
  EditPlayerApplicationDTO,
  Status,
} from "./types.js";

//PlayerService reference Has been removed.
// AuctionService has no use currently.

export interface PlayerApplicationService
  extends AddOnePlayerApplicationService,
    EditOnePlayerApplicationService,
    DeleteOnePlayerApplicationService,
    GetAllPlayerApplicationService {}

export interface GetAllPlayerApplicationService {
  getAll(): Promise<PlayerApplication[]>;
}
export interface AddOnePlayerApplicationService {
  addOne(application: CreatePlayerApplicationDTO): Promise<PlayerApplication>;
}
export interface EditOnePlayerApplicationService {
  editOne(
    applicationId: number,
    editApplicationDTO: EditPlayerApplicationDTO
  ): Promise<PlayerApplication>;
}
export interface DeleteOnePlayerApplicationService {
  deleteOne(applicationId: number): Promise<void>;
}

export class RestPlayerApplicationService implements PlayerApplicationService {
  async getAll(): Promise<PlayerApplication[]> {
    const { data } = await axios.get(
      "http://localhost:3000/playerApplications"
    );
    return data;
  }

  async addOne(
    application: CreatePlayerApplicationDTO
  ): Promise<PlayerApplication> {
    const newApplication: PlayerApplication = await axios.post(
      "http://localhost:3000/playerApplications",
      application
    );
    return newApplication;
  }

  async editOne(
    applicationId: number,
    editApplicationDTO: EditPlayerApplicationDTO
  ): Promise<PlayerApplication> {
    const editedApplication: PlayerApplication = await axios.patch(
      `http://localhost:3000/playerApplications/${applicationId}`,
      editApplicationDTO
    );
    console.log(editedApplication);
    return Promise.resolve(editedApplication);
  }

  async deleteOne(applicationId: number): Promise<void> {
    await axios.delete(
      `http://localhost:3000/playerApplications/${applicationId}`
    );
  }
}

export class LocallyStoredPlayerApplicationService
  implements PlayerApplicationService
{
  async getAll() {
    const playerApplications = localStorage.getItem("playerApplications");
    if (playerApplications)
      return Promise.resolve<PlayerApplication[]>(
        JSON.parse(playerApplications)
      );
    return Promise.resolve([]);
  }

  async addOne(application: CreatePlayerApplicationDTO) {
    const newApplication: PlayerApplication = new PlayerApplication(
      application
    );
    console.log(newApplication);
    const playerApplications = await this.getAll();
    localStorage.setItem(
      "playerApplications",
      JSON.stringify([...playerApplications, newApplication])
    );
    return newApplication;
  }

  async editOne(
    applicationId: number,
    editApplicationDTO: EditPlayerApplicationDTO
  ) {
    const applications = await this.getAll();
    const applicationToEdit = applications.find(
      (application) => application.id === applicationId
    );
    if (applicationToEdit) {
      applicationToEdit.roundBasePrice = editApplicationDTO.roundBasePrice;
      localStorage.setItem(
        "playerApplications",
        JSON.stringify([...applications, applicationToEdit])
      );
      return Promise.resolve(applicationToEdit);
    }
    return Promise.reject("Application not found to edit");
  }

  async deleteOne(applicationId: number) {
    const applications = await this.getAll();
    localStorage.setItem(
      "playerApplications",
      JSON.stringify(
        applications.filter((application) => application.id !== applicationId)
      )
    );
  }

  // async process(
  //   application: PlayerApplication,
  //   meta: PlayerApplicationMeta,
  //   status: Status,
  //   auctionService: AuctionService
  // ) {
  //   application.applicationMeta = meta;
  //   application.status = status;
  //   if (application.status === "accepted") {
  //     let approvedPlayerDTO: CreateApprovedPlayerDTO = {
  //       playerId: application.playerId,
  //       auctionId: application.auctionId,
  //       roundBasePrice: application.roundBasePrice,
  //     };
  //     let approvedPlayer = new ApprovedPlayer(approvedPlayerDTO);
  //     auctionService.addToPlayerPool(approvedPlayer);
  //     return Promise.resolve(application);
  //   } else {
  //     return Promise.reject(
  //       "please review your application according to rules of auction"
  //     );
  //     // return application;
  //   }
  // }
}

export class PlayerApplication {
  private static counter: number = 0;
  public readonly id: number;
  public readonly playerId: number;
  public readonly auctionId: string;
  public status: Status;
  public roundBasePrice: { [key: number]: number };
  public applicationMeta?: PlayerApplicationMeta;

  constructor(application: CreatePlayerApplicationDTO) {
    PlayerApplication.counter++;
    this.id = PlayerApplication.counter;
    this.auctionId = application.auctionId;
    this.playerId = application.playerId;
    this.status = "pending";
    this.roundBasePrice = application.roundBasePrice;
  }
}

const playerApplicationService = new RestPlayerApplicationService();
export default playerApplicationService;
