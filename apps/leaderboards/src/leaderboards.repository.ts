import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '@app/common';
import { LeaderboardDocument } from './models/leaderboard.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class LeaderboardsRepository extends AbstractRepository<LeaderboardDocument> {
  protected readonly logger = new Logger(LeaderboardsRepository.name);

  constructor(
    @InjectModel(LeaderboardDocument.name)
    leaderboardModel: Model<LeaderboardDocument>,
  ) {
    super(leaderboardModel);
  }
}
