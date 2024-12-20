import { v4 as uuidv4 } from 'uuid';
import { CreatePlayerApplicationDTO } from '../dto/create-player.dto';

export type Status = 'accepted' | 'rejected' | 'pending';

export class PlayerApplication {
  public readonly id: string;
  public readonly playerId: string;
  public readonly auctionId: string;
  public readonly submittedAt: string;
  public status: Status;
  public roundBasePrice: { [key: number]: number };
  // player application meta has been removed

  constructor(application: CreatePlayerApplicationDTO) {
    this.id = uuidv4();
    this.auctionId = application.auctionId;
    this.playerId = application.playerId;
    this.status = 'pending';
    this.roundBasePrice = application.roundBasePrice;
    this.submittedAt = new Date().toLocaleString();
  }
}
