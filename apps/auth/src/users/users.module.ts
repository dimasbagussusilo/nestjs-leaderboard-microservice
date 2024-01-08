import { Module } from "@nestjs/common";
import {
  DatabaseModule,
  HealthModule,
  LoggerModule,
  UserDocument,
  UserSchema,
} from "@app/common";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { UsersRepository } from "./users.repository";

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([
      { name: UserDocument.name, schema: UserSchema },
    ]),
    LoggerModule,
    HealthModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService],
})
export class UsersModule {}
