import { Team } from "./team/team.js";
import { CreateFranchiseDTO, EditFranchiseDTO } from "./types.js";

export interface AddOneFranchiseService {
  addOne(franchiseDTO: CreateFranchiseDTO): Promise<Franchise>;
}

export interface DeleteOneFranchiseService {
  deleteOne(id: number): Promise<void>;
}

export interface EditOneFranchiseService {
  editOne(id: number, franchiseDTO: EditFranchiseDTO): Promise<Franchise>;
}

export interface GetAllFranchiseService {
  getAll(): Promise<Franchise[]>;
}

export interface FranchiseService
  extends GetAllFranchiseService,
    EditOneFranchiseService,
    DeleteOneFranchiseService,
    AddOneFranchiseService {}

export class LocallyStoredFranchiseService implements FranchiseService {
  public franchises: Franchise[];

  constructor() {
    this.franchises = [];
  }

  async getAll() {
    return Promise.resolve(this.franchises);
  }

  async addOne(franchiseDTO: CreateFranchiseDTO) {
    let newFranchise = new Franchise(franchiseDTO);
    let franchises = await this.getAll();
    this.franchises = [...franchises, newFranchise];
    return Promise.resolve(newFranchise);
  }

  async deleteOne(franchiseId: number) {
    let franchises = await this.getAll();
    this.franchises = franchises.filter(
      (franchise) => franchise.id !== franchiseId
    );
  }

  async editOne(
    franchiseId: number,
    editFranchiseDTO: EditFranchiseDTO
  ): Promise<Franchise> {
    let franchises = await this.getAll();
    this.franchises = franchises.map((franchise) =>
      franchise.id === franchiseId
        ? { ...franchise, ...editFranchiseDTO }
        : franchise
    );

    let franchise = await this.findFranchise(franchiseId);
    if (!franchise) return Promise.reject("invalid franchise for editing");
    return Promise.resolve(franchise);
  }

  async findFranchise(franchiseId: number) {
    let franchises = await this.getAll();
    return Promise.resolve(
      franchises.find((franchise) => franchise.id === franchiseId)
    );
  }
}

export class Franchise {
  private static counter: number = 0;
  public readonly id: number;
  public readonly name: string;
  public readonly city: string;
  public teams: Team[];

  constructor(franchiseDTO: CreateFranchiseDTO) {
    Franchise.counter += 1;
    this.id = Franchise.counter;
    this.name = franchiseDTO.name;
    this.city = franchiseDTO.city;
    this.teams = [];
  }
}

const franchiseService = new LocallyStoredFranchiseService();
export default franchiseService;
