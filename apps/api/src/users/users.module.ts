import { Module } from '@nestjs/common';
import { RbacGuard } from '../rbac/rbac.guard';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, RbacGuard]
})
export class UsersModule {}
