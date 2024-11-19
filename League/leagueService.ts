import { Edition } from "../Edition/editionService"
import { CreateLeagueDTO } from "./Types"

export class LeagueService{
    public leagues: League[] = []

    getAll(){
        return this.leagues
    }

    addOne(league: CreateLeagueDTO){
        let newLeague:League = new League(league)
        this.leagues = [...this.leagues, newLeague]
        return newLeague
    }

    deleteOne(id:number){
        this.leagues=this.leagues.filter((league)=>league.id!==id)
    }
    findLeague(LeagueId:number){
        return this.leagues.find((League)=>League.id === LeagueId)
      }
}

export class League{
    public static counter: number = 0
    public id : number;
    public name: string;
    public editions: Edition[]

    constructor(league:CreateLeagueDTO){
        League.counter+=1
        this.name = league.name;
        this.id = League.counter;
        this.editions =[];
    }
}