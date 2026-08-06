import { Module } from '@nestjs/common';
import { RbacGuard } from '../rbac/rbac.guard';
import { GamesController } from './games.controller';
import { GamesService } from './games.service';

@Module({
  controllers: [GamesController],
  providers: [GamesService, RbacGuard]
})
export class GamesModule {}
