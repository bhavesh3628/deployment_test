import { PlayerApplication, PlayerApplicationService } from "../Application/Player/application";
import { CreatePlayerApplicationDTO, EditPlayerApplicationDTO } from "../Application/Player/types";
import { CreateEditionDTO } from "../Edition/Types";
import { PlayerService } from "./playerService";
import { CreatePlayerDTO, EditPlayerDTO } from "./Types";

describe("Player Service", () => {
  let playerService: PlayerService;
  let applicationService: PlayerApplicationService;
  beforeEach(() => {
    playerService = new PlayerService();
  });

  it("should start with no players", () => {
    const players = playerService.getAll();
    expect(players).toHaveLength(0);
  });

  it("should be able to add one player", () => {
    let players = playerService.getAll();
    expect(players).toHaveLength(0);
    let thala: CreatePlayerDTO = {
      dob: 2002,
      name: "Mahi",
      nationality: "indian",
      skills: {
        batter: 0,
        bowler: 0,
        allRounder: 0,
        wicketKeeper: 1,
      },
    };
    let newPlayer = playerService.addOne(thala);
    players = playerService.getAll();
    expect(players).toHaveLength(1);
  });

  it("Should able delete player", () => {
    let thala: CreatePlayerDTO = {
      dob: 2002,
      name: "Mahi",
      nationality: "indian",
      skills: {
        batter: 0,
        bowler: 0,
        allRounder: 0,
        wicketKeeper: 1,
      },
    };
    let newPlayer = playerService.addOne(thala);
    let players = playerService.getAll();
    expect(players).toHaveLength(1);
    let isDeleted = playerService.deleteOne(newPlayer.id);
    players = playerService.getAll();
    expect(players).toHaveLength(0);
    expect(isDeleted).toBeTruthy();
  });

  it("should be able to edit player profile", () => {
    let thala: CreatePlayerDTO = {
      dob: 2002,
      name: "Mahi",
      nationality: "indian",
      skills: {
        batter: 0,
        bowler: 0,
        allRounder: 0,
        wicketKeeper: 1,
      },
    };
    let newPlayer = playerService.addOne(thala);
    let editPlayer: EditPlayerDTO = {
      name: "msd",
    };
    playerService.editOne(newPlayer.id, editPlayer);
    let players = playerService.getAll();
    let player = players.find((player) => player.id === newPlayer.id);
    expect(player?.name).toBe("msd");
  });
  it("should be able to apply for auction application", () => {
    // auction
    // player
    //Applications
    let auctionId = 1; //findAuction()
    let thalaDTO: CreatePlayerDTO = {
      dob: 2002,
      name: "Mahi",
      nationality: "indian",
      skills: {
        batter: 0,
        bowler: 0,
        allRounder: 0,
        wicketKeeper: 1,
      },
    };
    let thala = playerService.addOne(thalaDTO);
    let applicationDTO: CreatePlayerApplicationDTO = {
      playerId: thala.id,
      auctionId,
      roundBasePrice: { 1: 100, 2: 50, 3: 1 },
    };
    applicationService = new PlayerApplicationService();
    let applications = applicationService.getAll();
    expect(applications).toHaveLength(0);
    let application: PlayerApplication = applicationService.addOne(applicationDTO);
    applications = applicationService.getAll();
    expect(applications).toHaveLength(1);
    expect(application.playerId).toBe(thala.id);
  });
  it("should not be able to apply for same auction more than once", () => {
    // auction
    // player
    //Applications
    let auctionId = 1; //findAuction()
    let thalaDTO: CreatePlayerDTO = {
      dob: 2002,
      name: "Mahi",
      nationality: "indian",
      skills: {
        batter: 0,
        bowler: 0,
        allRounder: 0,
        wicketKeeper: 1,
      },
    };
    let thala = playerService.addOne(thalaDTO);
    let applicationDTO: CreatePlayerApplicationDTO = {
      playerId: thala.id,
      auctionId,
      roundBasePrice: { 1: 100, 2: 50, 3: 1 },
    };
    applicationService = new PlayerApplicationService();
    let applications = applicationService.getAll();
    expect(applications).toHaveLength(0);
    let application1: PlayerApplication = applicationService.addOne(applicationDTO);
    applications = applicationService.getAll();
    expect(applications).toHaveLength(1);
    expect(application1.playerId).toBe(thala.id);

    expect(() => {
      applicationService.addOne(applicationDTO);
    }).toThrow("Application already exist for the auction, please edit it");
  });
  it("should be able to edit an application", () => {
    let auctionId = 1; //findAuction()
    let thalaDTO: CreatePlayerDTO = {
      dob: 2002,
      name: "Mahi",
      nationality: "indian",
      skills: {
        batter: 0,
        bowler: 0,
        allRounder: 0,
        wicketKeeper: 1,
      },
    };
    let thala = playerService.addOne(thalaDTO);
    let applicationDTO: CreatePlayerApplicationDTO = {
      playerId: thala.id,
      auctionId,
      roundBasePrice: { 1: 100, 2: 50, 3: 1 },
    };
    applicationService = new PlayerApplicationService();
    let applications = applicationService.getAll();
    expect(applications).toHaveLength(0);
    let application1: PlayerApplication = applicationService.addOne(applicationDTO);
    applications = applicationService.getAll();
    expect(applications).toHaveLength(1);
    expect(application1.playerId).toBe(thala.id);
    let editApplicationDTO: EditPlayerApplicationDTO = {
      roundBasePrice: { 1: 400, 3: 10 },
    };
    let editedPlayerApplication = applicationService.editOne(
      application1.id,
      editApplicationDTO
    );
    applications = applicationService.getAll();
    let editedApplication = applications.find(
      (application) => application.id === editedPlayerApplication?.id
    );
    expect(editedApplication?.roundBasePrice).toStrictEqual(
      editApplicationDTO.roundBasePrice
    );
  });

  it("should be able to delete application", () => {
    // auction
    // player
    //Applications
    let auctionId = 1; //findAuction()
    let thalaDTO: CreatePlayerDTO = {
      dob: 2002,
      name: "Mahi",
      nationality: "indian",
      skills: {
        batter: 0,
        bowler: 0,
        allRounder: 0,
        wicketKeeper: 1,
      },
    };
    let thala = playerService.addOne(thalaDTO);
    let applicationDTO: CreatePlayerApplicationDTO = {
      playerId: thala.id,
      auctionId,
      roundBasePrice: { 1: 100, 2: 50, 3: 1 },
    };
    applicationService = new PlayerApplicationService();
    let applications = applicationService.getAll();
    let application: PlayerApplication = applicationService.addOne(applicationDTO);
    applications = applicationService.getAll();
    expect(applications).toHaveLength(1);
    applicationService.deleteOne(application.id);
    applications = applicationService.getAll();
    expect(applications).toHaveLength(0);
  });
});
