import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from "@nestjs/common";
import { LeaderboardsService } from "./leaderboards.service";
import { CreateLeaderboardDto } from "./dto/create-leaderboard.dto";
import { UpdateLeaderboardDto } from "./dto/update-leaderboard.dto";
import { CurrentUser, JwtAuthGuard, Roles, UserDto } from "@app/common";

@Controller("leaderboards")
export class LeaderboardsController {
  constructor(private readonly leaderboardsService: LeaderboardsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createLeaderboardDto: CreateLeaderboardDto,
  ) {
    try {
      return await this.leaderboardsService.create(createLeaderboardDto);
    } catch (e) {
      return e;
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    return this.leaderboardsService.findAll();
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard)
  async findOne(@Param("id") id: string) {
    return this.leaderboardsService.findOne(id);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard)
  async update(@Param("id") id: string, @Body() updateLeaderboardDto: UpdateLeaderboardDto) {
    return this.leaderboardsService.update(id, updateLeaderboardDto);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  @Roles("Admin")
  async remove(@Param("id") id: string) {
    return this.leaderboardsService.remove(id);
  }
}
