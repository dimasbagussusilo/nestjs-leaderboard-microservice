import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {AbstractDocument} from '@app/common';

@Schema({collection: 'leaderboards', versionKey: false})
export class LeaderboardDocument extends AbstractDocument {
    @Prop({required: true, enum: ['gaming', 'sports', 'education']})
    type: string

    @Prop({required: true})
    title: string
}

export const LeaderboardSchema =
    SchemaFactory.createForClass(LeaderboardDocument);
