import { BadRequestException, Injectable } from '@nestjs/common';
import { GameStatus, LearningGroup } from '@prisma/client';
import { demoGames, isDemoMode } from '../common/demo-data';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class GamesService {
  constructor(private readonly prisma: PrismaService) {}

  async list(filters: { group?: LearningGroup; category?: string; status?: GameStatus }) {
    if (isDemoMode()) {
      return demoGames.filter(
        (game) =>
          (!filters.group || game.group === filters.group) &&
          (!filters.status || game.status === filters.status) &&
          (!filters.category || game.category?.slug === filters.category)
      );
    }

    await this.unlockReleasedGames();
    return this.prisma.game.findMany({
      where: {
        group: filters.group,
        status: filters.status,
        category: filters.category ? { slug: filters.category } : undefined
      },
      include: { category: true },
      orderBy: [{ group: 'asc' }, { title: 'asc' }]
    });
  }

  submit(id: string) {
    return this.transition(id, [GameStatus.DRAFT], GameStatus.PENDING_APPROVAL);
  }

  approve(id: string, approvedById: string) {
    return this.transition(id, [GameStatus.PENDING_APPROVAL], GameStatus.APPROVED, { approvedById });
  }

  lock(id: string, releaseDate: Date) {
    if (releaseDate <= new Date()) {
      throw new BadRequestException('Release date must be in the future');
    }
    return this.transition(id, [GameStatus.APPROVED], GameStatus.LOCKED, { releaseDate });
  }

  unlock(id: string) {
    return this.transition(id, [GameStatus.APPROVED, GameStatus.LOCKED], GameStatus.UNLOCKED);
  }

  private async transition(id: string, from: GameStatus[], to: GameStatus, extra = {}) {
    const game = await this.prisma.game.findUnique({ where: { id } });
    if (!game || !from.includes(game.status)) {
      throw new BadRequestException(`Game cannot move to ${to}`);
    }
    return this.prisma.game.update({ where: { id }, data: { status: to, ...extra } });
  }

  private unlockReleasedGames() {
    return this.prisma.game.updateMany({
      where: { status: GameStatus.LOCKED, releaseDate: { lte: new Date() } },
      data: { status: GameStatus.UNLOCKED }
    });
  }
}
