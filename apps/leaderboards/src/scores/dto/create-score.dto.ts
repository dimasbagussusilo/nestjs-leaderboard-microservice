import {IsMongoId, IsNotEmpty, IsNumber} from "class-validator";

export class CreateScoreDto {
  @IsNotEmpty()
  @IsMongoId()
  user_id: string;

  @IsNotEmpty()
  @IsMongoId()
  leaderboard_id: string;

  @IsNotEmpty()
  @IsNumber()
  score: number;
}
