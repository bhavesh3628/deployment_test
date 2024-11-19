import { CreateRegisteredFranchiseDTO } from "./types"

export class RegisteredFranchise{
    public purse:number
    public auctionId:number
    public franchiseId: number
    public readonly id: number
    public static counter:number = 0
    public team: number[]

    constructor(registeredFranchise:CreateRegisteredFranchiseDTO){
        RegisteredFranchise.counter += 1
        this.id = RegisteredFranchise.counter
        this.auctionId= registeredFranchise.auctionId
        this.franchiseId = registeredFranchise.franchiseId
        this.purse = registeredFranchise.purse
        this.team = []
    }
}

// export class RegisteredFranchiseService