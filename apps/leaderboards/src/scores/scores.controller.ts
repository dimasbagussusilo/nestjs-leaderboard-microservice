import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ScoresService } from "./scores.service";
import { CreateScoreDto } from "./dto/create-score.dto";
import { UpdateScoreDto } from "./dto/update-score.dto";
import {CurrentUser, JwtAuthGuard, UserDocument, UserDto} from "@app/common";
import { Throttle } from "@nestjs/throttler";

@Controller("scores")
export class ScoresController {
  constructor(private readonly scoresService: ScoresService) {}

  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createScoreDto: CreateScoreDto,
    @CurrentUser() user: UserDocument,
  ) {
    try {
      if (!user.roles.map(r => r.toLowerCase()).includes("admin")) {
        createScoreDto.user_id = user._id.toString()
      }
      return await this.scoresService.create(createScoreDto);
    } catch (e) {
      return e;
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    return this.scoresService.findAll();
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard)
  async findOne(@Param("id") id: string) {
    return this.scoresService.findOne(id);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard)
  async update(
    @Param("id") id: string,
    @Body() updateScoreDto: UpdateScoreDto,
  ) {
    return this.scoresService.update(id, updateScoreDto);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  // @Roles("Admin")
  async remove(@Param("id") id: string) {
    return this.scoresService.remove(id);
  }
}
