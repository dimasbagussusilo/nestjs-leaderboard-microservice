import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '@app/common';
import { ScoreDocument } from './models/score.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ScoresRepository extends AbstractRepository<ScoreDocument> {
  protected readonly logger = new Logger(ScoresRepository.name);

  constructor(
    @InjectModel(ScoreDocument.name)
    leaderboardModel: Model<ScoreDocument>,
  ) {
    super(leaderboardModel);
  }
}
