import {Module, NestModule, MiddlewareConsumer} from "@nestjs/common";
import * as Joi from "joi";
import {LeaderboardsService} from "./leaderboards.service";
import {LeaderboardsController} from "./leaderboards.controller";
import {
    AUTH_SERVICE,
    DatabaseModule,
    HealthModule,
    LoggerModule,
} from "@app/common";
import {LeaderboardsRepository} from "./leaderboards.repository";
import {
    LeaderboardDocument,
    LeaderboardSchema,
} from "./models/leaderboard.schema";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {ClientsModule, Transport} from "@nestjs/microservices";
import {ScoresController} from "./scores/scores.controller";
import {ScoresModule} from "./scores/scores.module";

@Module({
    imports: [
        DatabaseModule,
        DatabaseModule.forFeature([
            {name: LeaderboardDocument.name, schema: LeaderboardSchema},
        ]),
        LoggerModule,
        ConfigModule.forRoot({
            isGlobal: true,
            validationSchema: Joi.object({
                MONGODB_URI: Joi.string().required(),
                PORT: Joi.number().required(),
                AUTH_HOST: Joi.string().required(),
                AUTH_PORT: Joi.number().required(),
            }),
        }),
        ClientsModule.registerAsync([
            {
                name: AUTH_SERVICE,
                useFactory: (configService: ConfigService) => ({
                    transport: Transport.RMQ,
                    options: {
                        urls: [configService.getOrThrow<string>("RABBITMQ_URI")],
                        queue: "auth",
                    },
                }),
                inject: [ConfigService],
            },
        ]),
        HealthModule,
        ScoresModule,
    ],
    controllers: [LeaderboardsController, ScoresController],
    providers: [LeaderboardsRepository, LeaderboardsService],
})
export class LeaderboardsModule {}
