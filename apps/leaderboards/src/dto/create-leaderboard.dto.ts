import {IsNotEmpty, IsString} from "class-validator";

export class CreateLeaderboardDto {
    @IsString()
    @IsNotEmpty()
    type: string;

    @IsString()
    @IsNotEmpty()
    title: string;
}
