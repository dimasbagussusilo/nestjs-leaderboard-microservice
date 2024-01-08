import { Injectable } from "@nestjs/common";
import { CreateScoreDto } from "./dto/create-score.dto";
import { UpdateScoreDto } from "./dto/update-score.dto";
import { ScoresRepository } from "./scores.repository";
import { UserDocument } from "@app/common";

@Injectable()
export class ScoresService {
  constructor(private readonly scoresRepository: ScoresRepository) {}

  async create(createScoreDto: CreateScoreDto) {
    return this.scoresRepository.create(createScoreDto);
  }

  async findAll() {
    return this.scoresRepository.find({});
  }

  async findOne(_id: string) {
    return this.scoresRepository.findOne({ _id });
  }

  async update(_id: string, updateScoreDto: UpdateScoreDto) {
    return this.scoresRepository.findOneAndUpdate(
      { _id },
      { $set: updateScoreDto },
    );
  }

  async remove(_id: string) {
    return this.scoresRepository.findOneAndDelete({ _id });
  }
}
