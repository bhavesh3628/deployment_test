import { Team } from "./Team/team";
import { CreateFranchiseDTO, EditFranchiseDTO } from "./Types";

export class FranchiseService {
  public franchises: Franchise[];

  constructor() {
    this.franchises = [];
  }

  getAll() {
    return this.franchises;
  }

  addOne(franchiseDTO: CreateFranchiseDTO) {
    let newFranchise = new Franchise(franchiseDTO);
    this.franchises = [...this.franchises, newFranchise];
    return newFranchise;
  }

  deleteOne(franchiseId: number) {
    this.franchises = this.franchises.filter(
      (franchise) => franchise.id !== franchiseId
    );
  }

  editOne(franchiseId: number, editFranchiseDTO: EditFranchiseDTO) {
    this.franchises = this.franchises.map((franchise) =>
      franchise.id === franchiseId
        ? { ...franchise, ...editFranchiseDTO }
        : franchise
    );

    let franchise = this.franchises.find(
      (franchise) => franchise.id === franchiseId
    );

    return franchise;
  }
  findFranchise(franchiseId:number){
    return this.franchises.find((franchise)=>franchise.id=== franchiseId)
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
