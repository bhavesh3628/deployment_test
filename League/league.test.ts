import { LeagueService } from "./leagueService";
import { CreateLeagueDTO } from "./Types";

describe("league service", () => {
  let service: LeagueService;
  let iplDTO : CreateLeagueDTO 
  beforeEach(() => {
    service = new LeagueService();
    iplDTO = {
        name: "IPL"
    }

  });
  it("should start with no leagues", () => {
    //given

    //when
    const leagues =service.getAll()
    //then
    expect(leagues).toHaveLength(0)
  });
  it("should add one league", () => {
    let leagues = service.getAll();
    expect(leagues).toHaveLength(0);

    let newLeague = service.addOne(iplDTO)
    leagues = service.getAll()

    expect(leagues).toHaveLength(1)
    let currentLeague = leagues.find((league)=>league.name==='IPL')
    expect(currentLeague?.name).toBe("IPL")
  })
  it("should delete one league", () => {
    let leagues = service.getAll();
    expect(leagues).toHaveLength(0);

    let newLeague = service.addOne(iplDTO)
    leagues = service.getAll()

    expect(leagues).toHaveLength(1)
    service.deleteOne(newLeague.id)
    leagues=service.getAll()
    let deletedLeague = leagues.find((league)=>league.id===newLeague.id)
    expect(deletedLeague).toBeUndefined()
  })
});
