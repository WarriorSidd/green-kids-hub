import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleKey } from '@prisma/client';
import { demoRoles, isDemoMode } from '../common/demo-data';
import { PrismaService } from '../common/prisma.service';
import { PERMISSIONS_KEY } from './permissions.decorator';

@Injectable()
export class RbacGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const required = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass()
    ]);

    if (!required?.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user?.roleId) {
      throw new ForbiddenException('Missing role context');
    }

    if (isDemoMode()) {
      const granted = new Set(demoRoles[user.roleId as RoleKey] ?? []);
      const allowed = required.every((permission) => granted.has(permission));
      if (!allowed) {
        throw new ForbiddenException('Insufficient permissions');
      }
      return true;
    }

    const role = await this.prisma.role.findUnique({
      where: { id: user.roleId },
      include: { permissions: { include: { permission: true } } }
    });

    const granted = new Set(role?.permissions.map((item) => item.permission.key));
    const allowed = required.every((permission) => granted.has(permission));
    if (!allowed) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return true;
  }
}
