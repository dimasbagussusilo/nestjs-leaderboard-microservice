import { Module } from "@nestjs/common";
import {
  AUTH_SERVICE,
  DatabaseModule,
  HealthModule,
  LoggerModule,
} from "@app/common";
import { ScoreDocument, ScoreSchema } from "./models/score.schema";
import { ScoresRepository } from "./scores.repository";
import { ScoresService } from "./scores.service";
import { ScoresController } from "./scores.controller";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { ConfigService } from "@nestjs/config";
import { ThrottlerModule } from "@nestjs/throttler";

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    DatabaseModule,
    DatabaseModule.forFeature([
      { name: ScoreDocument.name, schema: ScoreSchema },
    ]),
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
    LoggerModule,
    HealthModule,
  ],
  controllers: [ScoresController],
  providers: [ScoresRepository, ScoresService],
  exports: [ScoresService],
})
export class ScoresModule {}
