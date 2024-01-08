import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {AbstractDocument} from "@app/common";
import {SchemaTypes} from "mongoose";

@Schema({collection: "scores", versionKey: false})
export class ScoreDocument extends AbstractDocument {
    @Prop({
        type: SchemaTypes.ObjectId,
        ref: "users",
    })
    user_id: string;

    @Prop({
        type: SchemaTypes.ObjectId,
        ref: "leaderboards",
    })
    leaderboard_id: string;

    @Prop({required: true})
    score: number
}

export const ScoreSchema = SchemaFactory.createForClass(ScoreDocument);
