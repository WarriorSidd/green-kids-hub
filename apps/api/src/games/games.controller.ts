import { Body, Controller, Get, Param, Patch, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GameStatus, LearningGroup } from '@prisma/client';
import { IsDateString } from 'class-validator';
import { permissions } from '../rbac/permissions';
import { RequirePermissions } from '../rbac/permissions.decorator';
import { RbacGuard } from '../rbac/rbac.guard';
import { GamesService } from './games.service';

class LockGameDto {
  @IsDateString()
  releaseDate: string;
}

@UseGuards(AuthGuard('jwt'), RbacGuard)
@Controller('games')
export class GamesController {
  constructor(private readonly games: GamesService) {}

  @Get()
  @RequirePermissions(permissions.PLAY_GAMES)
  list(@Query('group') group?: LearningGroup, @Query('category') category?: string, @Query('status') status?: GameStatus) {
    return this.games.list({ group, category, status });
  }

  @Patch(':id/submit')
  @RequirePermissions(permissions.CREATE_GAMES)
  submit(@Param('id') id: string) {
    return this.games.submit(id);
  }

  @Patch(':id/approve')
  @RequirePermissions(permissions.APPROVE_GAMES)
  approve(@Param('id') id: string, @Req() request: { user: { id: string } }) {
    return this.games.approve(id, request.user.id);
  }

  @Patch(':id/lock')
  @RequirePermissions(permissions.UNLOCK_GAMES)
  lock(@Param('id') id: string, @Body() dto: LockGameDto) {
    return this.games.lock(id, new Date(dto.releaseDate));
  }

  @Patch(':id/unlock')
  @RequirePermissions(permissions.UNLOCK_GAMES)
  unlock(@Param('id') id: string) {
    return this.games.unlock(id);
  }
}
