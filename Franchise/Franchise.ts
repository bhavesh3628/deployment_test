import { Team } from "./Team/team";
import { CreateFranchiseDTO, EditFranchiseDTO } from "./Types";

export class FranchiseService {
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

  async editOne(franchiseId: number, editFranchiseDTO: EditFranchiseDTO) {
    let franchises = await this.getAll();
    this.franchises = franchises.map((franchise) =>
      franchise.id === franchiseId
        ? { ...franchise, ...editFranchiseDTO }
        : franchise
    );

    let franchise = this.findFranchise(franchiseId);

    return Promise.resolve(franchise);
  }

  async findFranchise(franchiseId: number) {
    let franchises = await this.getAll();
    return Promise.resolve(
      franchises.find((franchise) => franchise.id === franchiseId)
    );
  }
}

class Franchise {
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
