import {Injectable} from "@nestjs/common";
import {CreateLeaderboardDto} from "./dto/create-leaderboard.dto";
import {UpdateLeaderboardDto} from "./dto/update-leaderboard.dto";
import {LeaderboardsRepository} from "./leaderboards.repository";
import {Types} from "mongoose";


@Injectable()
export class LeaderboardsService {
    constructor(private readonly leaderboardsRepository: LeaderboardsRepository) {
    }

    async create(createLeaderboardDto: CreateLeaderboardDto) {
        return this.leaderboardsRepository.create(createLeaderboardDto);
    }

    async findAll() {
        return this.leaderboardsRepository.aggregate([
            {
                $lookup: {
                    from: "scores",
                    localField: "_id",
                    foreignField: "leaderboard_id",
                    as: "scores"
                }
            },
            {
                $unwind: "$scores"
            },
            {
                $lookup: {
                    from: "users",
                    localField: "scores.user_id",
                    foreignField: "_id",
                    as: "scores.user"
                }
            },
            {
                $group: {
                    _id: {
                        _id: "$_id",
                        title: "$title"
                    },
                    scores: {
                        $push: {
                            _id: "$scores._id",
                            user_id: "$scores.user_id",
                            leaderboard_id: "$scores.leaderboard_id",
                            score: "$scores.score",
                            user: {
                                $arrayElemAt: [
                                    {
                                        $map: {
                                            input: "$scores.user",
                                            as: "userDoc",
                                            in: {
                                                _id: "$$userDoc._id",
                                                name: "$$userDoc.name",
                                                email: "$$userDoc.email",
                                            }
                                        }
                                    },
                                    0
                                ]
                            }
                        }
                    }
                }
            },
            {
                $unwind: "$scores"
            },
            {
                $sort: { "scores.score": -1 } // Sort scores in descending order
            },
            {
                $group: {
                    _id: {
                        _id: "$_id._id",
                        title: "$_id.title"
                    },
                    scores: { $push: "$scores" }
                }
            },
            {
                $project: {
                    _id: "$_id._id",
                    title: "$_id.title",
                    scores: { $slice: ["$scores", 10] } // Limit to the top 10 scores for each leaderboard
                }
            }
        ])
    }

    async findOne(_id: string) {
        const leaderboards = await this.leaderboardsRepository.aggregate([
            {
                $lookup: {
                    from: "scores",
                    localField: "_id",
                    foreignField: "leaderboard_id",
                    as: "scores"
                }
            },
            {
                $match: {
                    $and: [
                        {_id: new Types.ObjectId(_id)},
                        // TODO add user filter
                        // {"scores.user_id": new Types.ObjectId(userId)}
                    ]
                }
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    scores: {
                        $map: {
                            input: "$scores",
                            as: "uc",
                            in: {
                                _id: "$$uc._id",
                                user_id: "$$uc.user_id",
                                score: "$$uc.score",
                            }
                        }
                    },
                    messages: 1
                }
            }
        ]);

        return leaderboards[0]
    }

    async update(_id: string, updateLeaderboardDto: UpdateLeaderboardDto) {
        return this.leaderboardsRepository.findOneAndUpdate(
            {_id},
            {$set: updateLeaderboardDto},
        );
    }

    async remove(_id: string) {
        return this.leaderboardsRepository.findOneAndDelete({_id});
    }
}
